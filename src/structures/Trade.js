const Random = require('./../utils/random');
const CardCollection = require('./../structures/CardCollection');

class TradeUser
{
	constructor(Collector, data)
	{
		if (typeof data.storage === 'undefined') data.storage = [];
		if (typeof data.offers === 'undefined') data.offers = [];
		this.user = Collector.users.get(data.user);
		this.offers = new CardCollection(Collector, data.offers);
	}

	compress()
	{
		let data = {};
		data.user = this.user.id;
		data.offers = this.offers.compress();
	}
}

module.exports = class Trade
{
	constructor(Collector, data = {})
	{
		if (typeof data !== 'object') throw new Error('Offer data must be an object');
		if (typeof data.initiator === 'undefined') throw new Error('Offer Initiator must be defined');
		if (typeof data.recipient === 'undefined') throw new Error('Offer Recipient must be difened');
		if (typeof data.initiator.user === 'undefined') throw new Error('Offer Initiator User must be defined');
		if (typeof data.recipient.user === 'undefined') throw new Error('Offer Recipient User must be defined');
		if (typeof data.id === 'undefined') data.id = Random.string(4, 'abcdefghijklmnopqrstuvwxyz0123456789')
		this.collector = Collector;
		this.id = data.id;
		this.initiator = new TradeUser(Collector, data.initiator);
		this.recipient = new TradeUser(Collector, data.recipient);
	}

	offersCheck()
	{
		let errors = []
		for (let [card, count] of this.initiator.offers)
		{
			let owned = this.initiator.user.cards.get(card);
			if (owned >= count) continue;
			errors.push(`<@${this.initiator.user.id}> does not have ${count} of ${card}`);
		}
		for (let [card, count] of this.recipient.offers)
		{
			let owned = this.recipient.user.cards.get(card);
			if (owned >= count) continue;
			errors.push(`<@${this.recipient.user.id}> does not have ${count} of ${card}`);
		}
		return errors;
	}

	complete()
	{
		let errors = this.offersCheck();
		if (errors.length > 0) throw new Error(errors.join('\n'));
		for (let [card, count] of this.initiator.offers)
		{
			this.initiator.user.cards.remove(card, count);
			this.recipient.user.cards.add(card, count);
		}
		for (let [card, count] of this.recipient.offers)
		{
			this.recipient.user.cards.remove(card, count);
			this.initiator.user.cards.add(card, count);
		}
	}

	compress()
	{
		let data = {};
		data.id = this.id;
		data.initiator = this.initiator.compress();
		data.recipient = this.recipient.compress();
	}
}