const Handler = require('./Handler');
const Fuse = require('fuse.js');

module.exports = class SetHandler extends Handler
{
	constructor(Collector, options)
	{
		if (typeof options.items === 'undefined') options.items = new Map(Collector.trades);
		super(Collector, options);
		this.type = 'offer';
	}

	get offers()
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
			case 'initiator':
			{
				let initiator = filter.replace(/^initiator:?/gi, '');
				initiator = this.getUser(initiator);
				if (!initiator) return [];
				for (let [key, trade] of this.items)
				{
					if (trade.initiator.user.id === initiator.id) results.push(key);
				}
				break;
			}
			case 'recipient':
			{
				let recipient = filter.replace(/^recipient:?/gi, '');
				recipient = this.getUser(recipient);
				if (!recipient) return [];
				for (let [key, trade] of this.items)
				{
					if (trade.recipient.user.id === recipient.id) results.push(key);
				}
				break;
			}
			case 'card':
			default:
			{
				let id = filter.replace(/^card:?/gi, '');
				id = this.utils.formatCardID(id);
				for (let [key, trade] of this.items)
				{
					if (trade.initiator.offers.has(id) || trade.recipient.offers.has(id)) results.push(key);
				}
				break;
			}
		}
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
		super.processItems(require('./../../structures/Trade'), this.collector.trades);
	}

	sort()
	{
		super.sort({user: this.user});
	}
}
