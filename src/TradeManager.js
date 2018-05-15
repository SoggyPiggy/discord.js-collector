const diskdb = require('diskdb');
const path = require('path');
const Trade = require('./structures/Trade');

module.exports = class TradeManager extends Map
{
	constructor(Collector)
	{
		super();
		this.collector = Collector;
		this.collector.db.loadCollections(['trades']);

		let trades = this.collector.db.trades.find();
		for (let trade of trades)
		{
			trade = new Trade(Collector, trade);
			this.set(trade.id, trade);
			trade.initiator.user.trades.set(trade.id, trade);
			trade.recipient.user.trades.set(trade.id, trade);
		}
	}

	save(trade)
	{
		let id = this.parseID(trade);
		trade = this.get(id);
		if (trade)
		{
			let updated = this.collector.db.trades.update({id: id}, trade.compress(), {upsert: true});
			this.collector.emit('tradeSaved', trade, updated);
		}
	}

	delete(trade)
	{
		let id = this.parseID(trade);
		trade =this.get(id);
		if (trade)
		{
			super.delete(id);
			this.collector.db.trades.remove({id: id});
			this.collector.emit('tradeRemoved', trade);
		}
	}

	parseID(trade)
	{
		if (typeof trade === 'string') return trade;
		else if (typeof trade.id !== 'undefined') return String(trade.id);
	}
}