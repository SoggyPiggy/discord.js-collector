const Handler = require('./Handler');
const Fuse = require('fuse.js');

module.exports = class SetHandler extends Handler
{
	constructor(Collector, options)
	{
		if (typeof options.items === 'undefined') options.items = new Map(Collector.upgrades);
		super(Collector, options);
		this.type = 'upgrade';
	}

	get upgrades()
	{
		return this.items;
	}
	
	filter(filter, fallback)
	{
		if (!fallback.length) fallback = [{keys: ['tags'], threshold: 0 }, { keys: ['title'], threshold: .3}]
		if (this.items.has(this.utils.formatID(filter))) return [this.utils.formatID(filter)];
		let results = [];
		let filterParts = filter.split(':');
		let fuseoptions = { id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1 };
		let fuses = []
		let fuseItems = [];
		for (let [key, item] of this.items)
		{
			fuseItems.push(item.compress());
		}
		switch(filterParts[0])
		{
			case 'title':
			{
				filter = filter.replace(/^title:?/gi, '');
				fuseoptions.keys = ['title'];
				fuseoptions.threshold = .3;
				fuses.push(new Fuse(fuseItems, fuseoptions));
				break;
			}
			case 'tag':
			{
				filter = filter.replace(/^tag:?/gi, '');
				fuseoptions.keys = ['tags'];
				fuseoptions.threshold = 0;
				fuses.push(new Fuse(fuseItems, fuseoptions));
				break;
			}
			case 'description':
			{
				filter = filter.replace(/^description:?/gi, '');
				fuseoptions.keys = ['description'];
				fuseoptions.threshold = .5;
				fuses.push(new Fuse(fuseItems, fuseoptions));
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
			results = results.concat(fuse.search(filter))
		}
		results = Array.from(new Set(results));
		return results;
	}

	listItems(items, options)
	{
		let list = [];
		for (let [key, trade] of items)
		{
			list.push(trade.line(options));
		}
		return list;
	}

	processItems()
	{
		super.processItems(require('./../../structures/Upgrade'), this.collector.upgrades);
	}
}
