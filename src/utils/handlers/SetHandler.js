const Handler = require('./Handler');
const Set = require('./../../structures/Set');

module.exports = class SetHandler extends Handler
{
	constructor(Collector, options)
	{
		super(Collector, options);
		this.type = 'set';
	}

	get sets()
	{
		return this.items;
	}
	
	filter(filter)
	{
		let results = [];
		if (this.items.has(this.utils.formatSetID(filter))) return [this.utils.formatSetID(filter)];
		else if (filter.toLowerCase() === 'purchasable')
		{
			let results = [];
			for (let [key, set] of this.items)
			{
				if (set.purchasable) results.push(key);
			}
		}
		else if (filter.match(/^author:?/gi))
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
		}
		else
		{
			let fuseoptions = {id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
			let fuses = [];
			let fuseSets = [];
			for (let [key, set] of this.items)
			{
				fuseSets.push(set.compress());
			}
	
			if (filter.match(/title:?/gi))
			{
				filter = filter.replace(/title:?/gi, '');
				fuseoptions.keys = ['title'];
				fuseoptions.threshold = .3;
				fuses.push(new Fuse(fuseSets, fuseoptions));
			}
			else if (filter.match(/tag:?/gi))
			{
				filter = filter.replace(/tag:?/gi, '');
				fuseoptions.keys = ['tags', 'cards.tags'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseSets, fuseoptions));
			}
			else if (filter.match(/^description:?/g))
			{
				filter = filter.replace(/^description:?/gi, '');
				fuseoptions.keys = ['description'];
				fuseoptions.threshold = .5;
				fuses.push(new Fuse(fuseSets, fuseoptions));
			}
			else
			{
				for (let fallback of options.fallbackFilters)
				{
					fuseoptions.keys = fallback.keys;
					fuseoptions.threshold = fallback.threshold;
					fuses.push(new Fuse(fuseSets, fuseoptions));
				}
			}
			if (!filter) return [];
			for (let fuse of fuses)
			{
				results = mergeArray(results, fuse.search(filter));
			}
		}
		return results;
	}
}
