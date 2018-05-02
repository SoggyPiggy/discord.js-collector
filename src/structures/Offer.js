const Random = require('./../utils/random');

module.exports = class Offer
{
	constructor(Collector, data = {})
	{
		if (typeof data !== 'object') throw new Error('Offer data must be an object');
		if (typeof data.initiator === 'undefined') throw new Error('Offer Initiator must be defined');
		if (typeof data.target === 'undefined') throw new Error('Offer Recipient must be difened');
		if (typeof data.id === 'undefined') data.id = Random.
		this.collector = Collector;
		this.initiator = this.collector.users.get(data.initiator);
		this.recipient = this.collector.users.get(data.recipient);
	}

	compress()
	{
		let data = {};
		data.initiator = this.initiator.id;
		data.recipient = this.recipient.id;
		
	}
}