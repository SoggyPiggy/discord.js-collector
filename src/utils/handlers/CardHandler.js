const Handler = require('./Handler');
const Card = require('./../../structures/Card');
const Fuse = require('fuse.js');

module.exports = class CardHandler extends Handler
{
	constructor(Collector, options)
	{
		if (typeof options.items === 'undefined') options.items = new Map(Collector.registry.cards)
		super(Collector, options);
		this.type = 'card';
	}

	get cards()
	{
		return this.items;
	}

	filter(filter, fallback)
	{
		if (!fallback.length) fallback = [{keys: ['tags'], threshold: 0 }, { keys: ['title'], threshold: .3}]
		let results = [];
		if (this.items.has(this.utils.formatCardID(filter))) return [this.utils.formatCardID(filter)];
		let filterParts = filter.split(':');
		switch(filterParts[0])
		{
			case 'own':
			{
			let user = filter.replace(/^own:?/gi, '');
			user = this.getUser(user);
			if (!user) return [];
			for (let [key, card] of this.items)
			{
				if (user.cards.has(key)) results.push(key);
			}
				break;
		}
			case 'author':
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.getUser(author);
			if (!author) return [];
			for (let [key, card] of this.items)
			{
				if (card.author == author.id) results.push(key);
			}
				break;
		}
			default:
		{
			let fuseoptions = {id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
			let fuses = [];
			let fuseCards = [];
			for (let [key, card] of this.items)
			{
				fuseCards.push(card.compress());
			}
				switch(filterParts[0])
			{
					case 'rarity':
					{
				filter = filter.replace(/^rarity:?/gi, '');
				fuseoptions.keys = ['rarity'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
			}
					case 'tag':
			{
				filter = filter.replace(/^tag:?/gi, '');
				fuseoptions.keys = ['tags'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
			}
					case 'title':
			{
				filter = filter.replace(/^title:?/gi, '');
				fuseoptions.keys = ['title'];
				fuseoptions.threshold = .3;
				fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
			}
					case 'description':
			{
				filter = filter.replace(/^description:?/gi, '');
				fuseoptions.keys = ['description'];
				fuseoptions.threshold = .5;
				fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
			}
					default:
			{
				for (let fb of fallback)
				{
					fuseoptions.keys = fb.keys;
					fuseoptions.threshold = fb.threshold;
					fuses.push(new Fuse(fuseCards, fuseoptions));
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
		super.processItems(Card, this.collector.registry.cards);
	}
}