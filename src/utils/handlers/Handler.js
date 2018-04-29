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

function formatFilter(filter)
{
	return filter.toLowerCase().replace(/^(-|\+)/g, '');
}

module.exports = class Handler
{
	constructor(Collector, options={})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.user === 'undefined') options.user = null;
		if (typeof options.items === 'undefined') options.items = [];
		this.type = null;
		this.collector = Collector;
		this.utils = Collector.utils;
		this.user = options.user;
		this.items = options.items;
		this.unknowns = new Map();
		this.filters = {applied: [], ignored: [], used: []};
	}

	getUser(filter)
	{
		if (filter.length > 0) return this.collector.users.get(filter.replace(/^<@|>$/g, ''), false);
		else return this.user;
	}

	removeItems(keys)
	{
		for (let key of keys)
		{
			this.items.delete(key);
		}
	}

	retainItems(keys)
	{
		for (let [key, item] of this.items)
		{
			if (!keys.includes(key)) this.items.delete(key);
		}
	}

	filter(filter, fallback)
	{
		if (this.items.has(filter)) return [filter];
		else return [];
	}

	hasFilter(filter)
	{
		filter = formatFilter(filter);
		return this.filters.applied.includes(filter);
	}

	applyFilter(filter, fallback)
	{
		let exclude = filter.startsWith('-');
		filter = formatFilter(filter);
		if (this.hasFilter(filter)) return false;
		else this.filters.applied.push(filter);
		let keys = this.filter(filter, fallback);
		if (keys.length <= 0) return false;
		if (exclude) this.removeItems(keys);
		else this.retainItems(keys);
		return true;
	}

	applyFilters(filterString, fallback)
	{
		if (typeof filterString !== 'string') return;
		if (typeof fallback === 'undefined') fallback = [];
		let filters = seperateFilters(filterString);
		let used = [];
		let ignored = [];
		if (filters.length <= 0) return {used, ignored};
		this.checkVisibility();
		for (let filter of filters)
		{
			if (this.applyFilter(filter, fallback))
			{
				this.filters.used.push(filter);
				used.push(filter);
			}
			else
			{
				this.filters.ignored.push(filter);
				ignored.push(filter);
			}
		}
		return {used, ignored};
	}

	pagify(page = 1)
	{
		page = page - 1;
		let items = Array.from(this.items.entries());
		let pageItems = [];
		let itemsPerPage = 30;
		let pageMax = Math.ceil(items.length / itemsPerPage);
		if (page < 0) page = 0;
		if (page >= pageMax) page = pageMax - 1;
		for (let i = (itemsPerPage * page); (i < (itemsPerPage * (page + 1))) && i < items.length; i++)
		{
			pageItems.push(items[i]);
		}
		return {page: page + 1, max: pageMax, results: new Map(pageItems)};
	}

	sort()
	{
		let itemArray = Array.from(this.items.entries());
		switch(this.type)
		{
			case 'card': this.utils.smartsort.cards(itemArray); break;
			case 'set': this.utils.smartsort.sets(itemArray); break;
			default: itemArray.sort();
		}
		this.items = new Map(itemArray);
	}

	checkVisibility(override = false)
	{
		if (this._visibilityChecked) return;
		this._visibilityChecked = true;
		for (let [key, item] of this.items)
		{
			let owned = false;
			if (this.user) item.owned(this.user);
			if ((item.visibility > 2) && !(owned && override)) this.items.delete(key);
			else if ((item.visibility > 1) && !owned) this.items.delete(key);
		}
	}

	checkUnknown()
	{
		if (this._unknownChecked) return;
		this._unknownChecked = true;
		for (let [key, item] of this.items)
		{
			if (typeof item === 'object') continue;
			this.unknowns.set(key, item);
			this.items.delete(key);
		}
	}

	checks(override)
	{
		this.checkUnknown();
		this.checkVisibility(override);
	}

	processItems(type, registry)
	{
		if (this.items instanceof Map) return new Map(this.items);
		let itemsMap = new Map();
		for (let item of this.items)
		{
			if (item instanceof type) itemsMap.set(item.id, item);
			else
			{
				itemsMap.set(item, item);
				item = registry.get(item);
				if (typeof item === 'undefined') continue;
				itemsMap.set(item.id, item);
			}
		}
		this.items = itemsMap;
	}
}