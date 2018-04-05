const Fuse = require('fuse.js');

let splitFilters = function(filterString)
{
	let regex = /[^\s"]+|"([^"]*)"/gi;
	let filters = [];
	let match = true;
	while (match)
	{
		match = regex.exec(filterString);
		if (match != null)
		{
			if (match[1]) filters.push(match[1])
			else filters.push(match[0]);
		}
	}
	return filters;
}

module.exports = class Searcher
{
	constructor(Collector, User)
	{
		this.collector = Collector;
		this.utils = Collector.utils;
		this.options = Collector.options;
		this.cards = Collector.registry.cards;
		this.set = Collector.registry.sets;
		this.user = User;
	}

	searchCards(filterString = '')
	{
		let usedFilters = [];
		let ignoredFilters = []
		let filters = splitFilters(filterString);
		let cards = new Map(this.cards);
		for (let [key, card] of cards)
		{
			let owned = this.user.cards.has(card.id);
			if ((card.visibility >= 2 && !owned) || card.visibility >= 3) cards.delete(key);
		}
		for (let filter of filters)
		{
			filter = filter.toLowerCase();
			let filterCards = [];
			if (filter.startsWith('-'))
			{
				filterCards = this.filterCards(filter.replace(/^-/g, ''), cards);
				if (filterCards.length > 0)
				{
					for (let v of filterCards)
					{
						if (cards.has(v)) cards.delete(v);
					}
					usedFilters.push(filter);
				}
				else ignoredFilters.push(filter);
			}
			else
			{
				filterCards = this.filterCards(filter.replace(/^\+/g, ''), cards);
				if (filterCards.length > 0)
				{
					for (let [key, card] of cards)
					{
						if (!filterCards.includes(card.id)) cards.delete(key);
					}
					usedFilters.push(filter);
				}
				else ignoredFilters.push(filter);
			}
		}
		let data = {};
		data.results = cards;
		data.used = usedFilters;
		data.ignored = ignoredFilters;
		return data;
	}

	filterUser(filter)
	{
		if (filter.length > 0)
		{
			let regexDiscordTag = /(?:<@)(\d+)(?=>)/gi;
			let matches = regexDiscordTag.exec(filter);
			if (matches[1] != null) return this.collector.users.get(matches[1], false);
			else return false;
		}
		else return this.user;
	}

	filterCards(filter, cards)
	{
		let options = { id: 'id', threshold: .5, location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
		if (cards.has(this.utils.formatCardID(filter)))
		{
			return [this.utils.formatCardID(filter)];
		}
		else if (filter.search(/^((owned|collected)(:|))/gi) >= 0)
		{
			let user = filter.replace(/^((owned|collected)(:|))/gi, '');
			user = this.filterUser(user);
			if (!user) return [];
			let results = [];
			for (let [key, card] of cards)
			{
				if (user.cards.has(key)) results.push(key);
			}
			return results;
		}
		else if (filter.search(/^(author(:|))/gi) >= 0)
		{
			let author = filter.replace(/^(author(:|))/gi, '');
			author = this.filterUser(author);
			if (!author) return [];
			let results = [];
			for (let [key, card] of cards)
			{
				if (card.author == author.id) results.push(key);
			}
			return results;
		}
		else
		{
			let fuseCards = [];
			for (let [key, value] of cards)
			{
				fuseCards.push(value.compress());
			}

			if (filter.search(/^(rarity(:|))/gi) >= 0)
			{
				filter = filter.replace(/^(rarity(:|))/gi, '');
				options.keys = ['rarity'];
				options.threshold = 0;
			}
			else if (filter.search(/^(tag(:|))/gi) >= 0)
			{
				filter = filter.replace(/^(tag(:|))/gi, '');
				options.keys = ['tags'];
			}
			else if (filter.search(/^(title(:|))/gi) >= 0)
			{
				filter = filter.replace(/^(title(:|))/gi, '');
				options.keys = ['title'];
			}
			else if (filter.search(/^(description(:|))/gi) >= 0)
			{
				filter = filter.replace(/^(description(:|))/gi, '');
				options.keys = ['description'];
			}
			else
			{
				options.keys = ['tags', 'title'];
			}
			if (!filter) return [];
			let fuse = new Fuse(fuseCards, options);
			return fuse.search(filter);
		}
		return [];
	}

	searchSets(filterString = '')
	{
	}
}