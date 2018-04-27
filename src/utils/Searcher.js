const Fuse = require('fuse.js');
const Card = require('./../structures/Card');
const Set = require('./../structures/Set');

function seperateFilters(filterString)
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

function mergeArray(array1, array2)
{
	let long = array1;
	let short = array2;
	if (array1.length < array2.length)
	{
		long = array2;
		short = array1;
	}
	for (let v of short)
	{
		if (!long.includes(v)) long.push(v);
	}
	return long;
}

function remove(keys, map)
{
	for (let key of keys)
	{
		if (map.has(key)) map.delete(key);
	}
}

function keep(keys, map)
{
	for (let [key, item] of map)
	{
		if (!keys.includes(key)) map.delete(key);
	}
}

function removeVisibilities(map, key, item, options)
{
	if (options.visiblityCheck)
	{
		let owned = false;
		if (options.user) owned = item.owned(options.user);
		if (item.visibility > 1)
		{
			if (item.visibility > 2)
			{
				if (!(owned && options.ownedOverride)) map.delete(key);
			}
			else
			{
				if (!owned) map.delete(key);
			}
		}
	}
}

module.exports = class Searcher
{
	constructor(Collector)
	{
		this.collector = Collector;
		this.utils = Collector.utils;
	}

	filterUser(filter, options)
	{
		if (filter.length > 0)
		{
			filter = filter.replace(/^<@|>$/g, '');
			return this.collector.users.get(filter, false);
		}
		else return options.user;
	}

	searchCards(filterString = '', options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.sort === 'undefined') options.sort = true;
		if (typeof options.user === 'undefined') options.user = null;
		if (typeof options.cards === 'undefined') options.cards = new Map(this.collector.registry.cards);
		if (typeof options.visiblityCheck === 'undefined') options.visiblityCheck = true;
		if (typeof options.ownedOverride === 'undefined') options.ownedOverride = false;
		if (typeof options.fallbackFilters === 'undefined') options.fallbackFilters = [{ keys: ['tags'], threshold: 0 }, { keys: ['title'], threshold: .3 }];
		if (!options.cards instanceof Map) options.cards = this.utils.convertCardsMap(options.cards);
		let appliedFilters = [];
		let usedFilters = [];
		let ignoredFilters = [];
		let filters = seperateFilters(filterString);
		for (let [key, card] of options.cards)
		{
			if (!card instanceof Card) options.cards.delete(key);
			else removeVisibilities(options.cards, key, card, options);
		}
		if (filters.length > 0)
		{
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
				let filterCards = this.filterCards(filter, options);
				if (filterCards.length > 0) usedFilters.push(rawFilter);
				else
				{
					ignoredFilters.push(rawFilter);
					continue;
				}
				if (exclude) remove(filterCards, options.cards)
				else keep(filterCards, options.cards)
			}
		}
		if (options.sort)
		{
			let arrayCards = Array.from(options.cards.entries());
			this.utils.smartsort.cards(arrayCards);
			options.cards = new Map(arrayCards);
		}
		let data = {};
		data.results = options.cards;
		data.used = usedFilters;
		data.ignored = ignoredFilters;
		return data;
	}

	filterCards(filter, options)
	{
		let results = [];
		if (options.cards.has(this.utils.formatCardID(filter))) return [this.utils.formatCardID(filter)];
		else if (filter.match(/^own:?/gi))
		{
			let user = filter.replace(/^own:?/gi, '');
			user = this.filterUser(user, options);
			if (!user) return [];
			for (let [key, card] of options.cards)
			{
				if (user.cards.has(key)) results.push(key);
			}
		}
		else if (filter.match(/^author:?/gi))
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.filterUser(author, options);
			if (!author) return [];
			for (let [key, card] of options.cards)
			{
				if (card.author == author.id) results.push(key);
			}
		}
		else
		{
			let fuseoptions = { id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1 };
			let fuses = [];
			let fuseCards = [];
			for (let [key, card] of options.cards)
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
				for (let fallback of options.fallbackFilters)
				{
					fuseoptions.keys = fallback.keys;
					fuseoptions.threshold = fallback.threshold;
					fuses.push(new Fuse(fuseCards, fuseoptions));
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

	searchSets(filterString = '', options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.sort === 'undefined') options.sort = true;
		if (typeof options.user === 'undefined') options.user = null;
		if (typeof options.sets === 'undefined') options.sets = new Map(this.collector.registry.sets);
		if (typeof options.visiblityCheck === 'undefined') options.visiblityCheck = true;
		if (typeof options.ownedOverride === 'undefined') options.ownedOverride = false;
		if (typeof options.fallbackFilters === 'undefined') options.fallbackFilters = [{ keys: ['tags'], threshold: 0 }, { keys: ['title'], threshold: .3 }];
		if (!options.sets instanceof Map) options.sets = this.utils.convertSetsMap(options.sets);
		let appliedFilters = [];
		let usedFilters = [];
		let ignoredFilters = [];
		let filters = seperateFilters(filterString);
		for (let [key, set] of options.sets)
		{
			if (!set instanceof Set) options.sets.delete(key);
			else removeVisibilities(options.sets, key, set, options);
		}
		if (filters.length > 0)
		{
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
				let filterSets = this.filterSets(filter, options);
				if (filterSets.length > 0) usedFilters.push(rawFilter);
				else
				{
					ignoredFilters.push(rawFilter);
					continue;
				}
				if (exclude) remove(filterSets, options.sets)
				else keep(filterSets, options.sets)
			}
		}
		if (options.sort)
		{
			let arraySets = Array.from(options.sets.entries());
			this.utils.smartsort.sets(arraySets);
			options.sets = new Map(arraySets);
		}
		let data = {};
		data.results = options.sets;
		data.used = usedFilters;
		data.ignored = ignoredFilters;
		return data;
	}

	filterSets(filter, options)
	{
		let results = [];
		if (options.sets.has(this.utils.formatSetID(filter))) return [this.utils.formatSetID(filter)];
		else if (filter.toLowerCase() === 'purchasable')
		{
			let results = [];
			for (let [key, set] of options.sets)
			{
				if (set.purchasable) results.push(key);
			}
		}
		else if (filter.match(/^author:?/gi))
		{
			let author = filter.replace(/^author:?/gi, '');
			author = this.filterUser(author, options);
			if (!author) return [];
			for (let [key, set] of options.sets)
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
			let fuseoptions = { id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1 };
			let fuses = [];
			let fuseSets = [];
			for (let [key, set] of options.sets)
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