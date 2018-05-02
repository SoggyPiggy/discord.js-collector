const Random = require('./../utils/random');

module.exports = class Offer
{
	constructor(Collector, data = {})
	{
		if (typeof data !== 'object') throw new Error('Offer data must be an object');
		if (typeof data.trader === 'undefined') throw new Error('Offer trader must be defined');
		if (typeof data.target === 'undefined') throw new Error('Offer target must be difened');
		if (typeof data.id === 'undefined') data.id = Random.
		this.collector = Collector;
		this.initiator;
		this.recipient;
		this.offerings = [];
		this.requests = [];
		this.storage = [];
	}
}