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
		}
	}
}