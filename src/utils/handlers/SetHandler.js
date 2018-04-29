const Handler = require('./Handler');
const Set = require('./../../structures/Set');
const Fuse = require('fuse.js');

module.exports = class SetHandler extends Handler
{
	constructor(Collector, options)
	{
		if (typeof options.items === 'undefined') options.items = new Map(Collector.registry.sets);
		super(Collector, options);
		this.type = 'set';
	}

	get sets()
	{
		return this.items;
	}
	
	filter(filter, fallback)
	{
		if (!fallback.length) fallback = [{keys: ['tags'], threshold: 0 }, { keys: ['title'], threshold: .3}]
		let results = [];
		if (this.items.has(this.utils.formatSetID(filter))) return [this.utils.formatSetID(filter)];
		let filterParts = filter.split(':');
		switch(filterParts[0])
		{
			case 'purchasable':
			{
			for (let [key, set] of this.items)
			{
				if (set.purchasable) results.push(key);
			}
				break;
		}
			case 'author':
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.getUser(author, options);
			if (!author) return [];
			for (let [key, set] of this.items)
			{
				if (set.author == author.id)
				{
					results.push(key);
					continue;
				}
				for (let card of set.cards)
				{
					if (card.author != author.id) continue;
					results.push(key);
					break;
				}
			}
				break;
		}
			default:
		{
			let fuseoptions = {id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
			let fuses = [];
			let fuseSets = [];
			for (let [key, set] of this.items)
			{
				fuseSets.push(set.compress());
			}
				switch(filterParts[0])
				{
					case 'title':
			{
				filter = filter.replace(/title:?/gi, '');
				fuseoptions.keys = ['title'];
				fuseoptions.threshold = .3;
				fuses.push(new Fuse(fuseSets, fuseoptions));
						break;
			}
					case 'tag':
			{
				filter = filter.replace(/tag:?/gi, '');
				fuseoptions.keys = ['tags', 'cards.tags'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseSets, fuseoptions));
						break;
			}
					case 'description':
			{
				filter = filter.replace(/^description:?/gi, '');
				fuseoptions.keys = ['description'];
				fuseoptions.threshold = .5;
				fuses.push(new Fuse(fuseSets, fuseoptions));
						break;
			}
					default:
			{
				for (let fb of fallback)
				{
					fuseoptions.keys = fb.keys;
					fuseoptions.threshold = fb.threshold;
					fuses.push(new Fuse(fuseSets, fuseoptions));
				}
						break;
					}
			}
			if (!filter) return [];
			for (let fuse of fuses)
			{
					results.concat(fuse.search(filter))
			}
				results = Array.from(new Set(results));
		}
		}
		return results;
	}

	processItems()
	{
		super.processItems(Set, this.collector.registry.sets);
	}
}
