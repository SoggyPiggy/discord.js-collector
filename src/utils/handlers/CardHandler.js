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
		else if (filter.match(/^own:?/gi))
		{
			let user = filter.replace(/^own:?/gi, '');
			user = this.getUser(user);
			if (!user) return [];
			for (let [key, card] of this.items)
			{
				if (user.cards.has(key)) results.push(key);
			}
		}
		else if (filter.match(/^author:?/gi))
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.getUser(author);
			if (!author) return [];
			for (let [key, card] of this.items)
			{
				if (card.author == author.id) results.push(key);
			}
		}
		else
		{
			let fuseoptions = {id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
			let fuses = [];
			let fuseCards = [];
			for (let [key, card] of this.items)
			{
				fuseCards.push(card.compress());
			}
			if (filter.match(/^rarity:?/gi))
			{
				filter = filter.replace(/^rarity:?/gi, '');
				fuseoptions.keys = ['rarity'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseCards, fuseoptions));
			}
			else if (filter.match(/^tag:?/gi))
			{
				filter = filter.replace(/^tag:?/gi, '');
				fuseoptions.keys = ['tags'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseCards, fuseoptions));
			}
			else if (filter.match(/^title:?/gi))
			{
				filter = filter.replace(/^title:?/gi, '');
				fuseoptions.keys = ['title'];
				fuseoptions.threshold = .3;
				fuses.push(new Fuse(fuseCards, fuseoptions));
			}
			else if (filter.match(/^description:?/gi))
			{
				filter = filter.replace(/^description:?/gi, '');
				fuseoptions.keys = ['description'];
				fuseoptions.threshold = .5;
				fuses.push(new Fuse(fuseCards, fuseoptions));
			}
			else
			{
				for (let fb of fallback)
				{
					fuseoptions.keys = fb.keys;
					fuseoptions.threshold = fb.threshold;
					fuses.push(new Fuse(fuseCards, fuseoptions));
				}
			}
			if (!filter) return [];
			for (let fuse of fuses)
			{
				results = Array.from(new Set(results.concat(fuse.search(filter))));
			}
		}
		return results;
	}

	processItems()
	{
		super.processItems(Card, this.collector.registry.cards);
	}
}