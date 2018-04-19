const Fuse = require('fuse.js');

let splitFilters = function(filterString)
{
	let regex = /".+?"|[.\S]+".+?"|[.\S]+/gi;
	let filters = [];
	let match = true;
	while (match)
	{
		match = regex.exec(filterString);
		if (match) filters.push(match[0].replace(/"/g, ''));
	}
	return filters;
}

let mergeArray = function(array1, array2)
{
	let a1 = array1;
	let a2 = array2;
	if (a2.length < a1.length)
	{
		a1 = array2;
		a2 = array1;
	}
	for (let v in a1)
	{
		if (!a2.includes(v)) a2.push(v);
	}
	return a2;
}

module.exports = class Searcher
{
	constructor(Collector, User)
	{
		this.collector = Collector;
		this.utils = Collector.utils;
		this.options = Collector.options;
		this.cards = Collector.registry.cards;
		this.sets = Collector.registry.sets;
		this.user = User;
	}

	searchCards(filterString = '')
	{
		let appliedFilters = [];
		let usedFilters = [];
		let ignoredFilters = [];
		let filters = splitFilters(filterString);
		let cards = new Map(this.cards);
		for (let [key, card] of cards)
		{
			let owned = this.user.cards.has(card.id);
			if (card.visibility > 1)
			{
				if (card.visibility > 2) cards.delete(key);
				else if (!owned) cards.delete(key);
			}
		}
		for (let rawFilter of filters)
		{
			let filter = rawFilter.toLowerCase();
			let exclude = filter.startsWith('-');
			filter = filter.replace(/^(-|\+)/g, '');
			if (!appliedFilters.includes(filter)) appliedFilters.push(filter);
			else
			{
				ignoredFilters.push(rawFilter);
				continue;
			}
			let filterCards = this.filterCards(filter, cards);
			if (filterCards.length > 0) usedFilters.push(rawFilter);
			else
			{
				ignoredFilters.push(rawFilter);
				continue;
			}
			if (exclude)
			{
				for (let v of filterCards)
				{
					if (cards.has(v)) cards.delete(v);
				}
			}
			else
			{
				for (let [key, card] of cards)
				{
					if (!filterCards.includes(key)) cards.delete(key);
				}
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
		let results = [];
		if (cards.has(this.utils.formatCardID(filter))) return [this.utils.formatCardID(filter)];
		else if (filter.match(/^owned:?/gi))
		{
			let user = filter.replace(/^owned:?/gi, '');
			user = this.filterUser(user);
			if (!user) return [];
			for (let [key, card] of cards)
			{
				if (user.cards.has(key)) results.push(key);
			}
		}
		else if (filter.match(/^author:?/gi))
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.filterUser(author);
			if (!author) return [];
			for (let [key, card] of cards)
			{
				if (card.author == author.id) results.push(key);
			}
		}
		else
		{
			let options = { id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
			let fuses = [];
			let fuseCards = [];
			for (let [key, card] of cards)
			{
				fuseCards.push(card.compress());
			}
			if (filter.match(/^rarity:?/gi))
			{
				filter = filter.replace(/^rarity:?/gi, '');
				options.keys = ['rarity'];
				options.threshold = 0;
				fuses.push(new Fuse(fuseCards, options));
			}
			else if (filter.match(/^tag:?/gi))
			{
				filter = filter.replace(/^tag:?/gi, '');
				options.keys = ['tags'];
				options.threshold = 0;
				fuses.push(new Fuse(fuseCards, options));
			}
			else if (filter.match(/^title:?/gi))
			{
				filter = filter.replace(/^title:?/gi, '');
				options.keys = ['title'];
				options.threshold = .3;
				fuses.push(new Fuse(fuseCards, options));
			}
			else if (filter.match(/^description:?/gi))
			{
				filter = filter.replace(/^description:?/gi, '');
				options.keys = ['description'];
				options.threshold = .5;
				fuses.push(new Fuse(fuseCards, options));
			}
			else
			{
				let fuse;
				options.keys = ['tags'];
				options.threshold = 0;
				fuses.push(new Fuse(fuseCards, options));
				options.keys = ['title'];
				options.threshold = .3;
				fuses.push(new Fuse(fuseCards, options));
			}
			if (!filter) return [];
			for (let fuse of fuses)
			{
				results = mergeArray(results, fuse.search(filter));
			}
		}
		return results;
	}

	searchSets(filterString = '')
	{
		let appliedFilters = [];
		let usedFilters = [];
		let ignoredFilters = [];
		let filters = splitFilters(filterString);
		let sets = new Map(this.sets);
		for (let [key, set] of sets)
		{
			if (set.visibility > 1)
			{
				if (set.visibility > 2) sets.delete(key);
				else
				{
					let owned = set.owned(this.user);
					if (owned.length > 0) continue;
					else sets.delete(key);
				}
			}
		}
		for (let rawFilter of filters)
		{
			let filter = rawFilter.toLowerCase();
			let exclude = filter.startsWith('-');
			filter = filter.replace(/^(-|\+)/g, '');
			if (!appliedFilters.includes(filter)) appliedFilters.push(filter);
			else
			{
				ignoredFilters.push(rawFilter);
				continue;
			}
			let filterSets = this.filterSets(filter, sets);
			if (filterSets.length > 0) usedFilters.push(rawFilter);
			else
			{
				ignoredFilters.push(rawFilter);
				continue;
			}
			if (exclude)
			{
				for (let v of filterSets)
				{
					if (sets.has(v)) sets.delete(v);
				}
			}
			else
			{
				for (let [key, set] of sets)
				{
					if (!filterSets.includes(key)) sets.delete(key);
				}
			}
		}
		let data = {};
		data.results = sets;
		data.used = usedFilters;
		data.ignored = ignoredFilters;
		return data;
	}

	filterSets(filter, sets)
	{
		let results = [];
		if (sets.has(this.utils.formatSetID(filter))) return [this.utils.formatSetID(filter)];
		else if (filter.match(/^purchasable/gi))
		{
			let results = [];
			for (let [key, set] of sets)
			{
				if (set.purchasable) results.push(key);
			}
		}
		else if (filter.match(/^author:/gi))
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.filterUser(author);
			if (!author) return [];
			for (let [key, set] of sets)
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
			let options = {id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
			let fuses = [];
			let fuseSets = [];
			for (let [key, set] of sets)
			{
				fuseSets.push(set.compress());
			}

			if (filter.match(/title:?/gi))
			{
				filter = filter.replace(/title:?/gi, '');
				options.keys = ['title'];
				options.threshold = .3;
				fuses.push(new Fuse(fuseSets, options));
			}
			else if (filter.match(/tag:?/gi))
			{
				filter = filter.replace(/tag:?/gi, '');
				options.keys = ['tags', 'cards.tags'];
				options.threshold = 0;
				fuses.push(new Fuse(fuseSets, options));
			}
			else if (filter.match(/^description:?/g))
			{
				filter = filter.replace(/^description:?/gi, '');
				options.keys = ['description'];
				options.threshold = .5;
				fuses.push(new Fuse(fuseCards, options));
			}
			else
			{
				let fuse;
				options.keys = ['tags'];
				options.threshold = 0;
				fuses.push(new Fuse(fuseSets, options));
				options.keys = ['title'];
				options.threshold = .3;
				fuses.push(new Fuse(fuseSets, options))
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