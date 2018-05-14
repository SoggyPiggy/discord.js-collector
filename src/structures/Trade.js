const Random = require('./../utils/random');
const CardCollection = require('./../structures/CardCollection');

class TradeUser
{
	constructor(Collector, data)
	{
		if (data instanceof Collector.structures.User) data = {user: data};
		else if (typeof data === 'string') data = {user: Collector.users.get(data)};
		else if (typeof data !== 'object') throw new Error('Trade User must either be a User or UserID string')
		else data.user = Collector.users.get(data.user);
		if (typeof data.offers === 'undefined') data.offers = [];
		this.user = data.user;
		this.offers = new CardCollection(Collector, data.offers);
	}

	compress()
	{
		let data = {};
		data.user = this.user.id;
		data.offers = this.offers.compress();
		return data;
	}

	toString()
	{
		return `<@${this.user.id}>`;
	}
}

module.exports = class Trade
{
	constructor(Collector, data = {})
	{
		if (typeof data !== 'object') throw new Error('Offer data must be an object');
		if (typeof data.initiator === 'undefined') throw new Error('Offer Initiator must be difened');
		if (typeof data.recipient === 'undefined') throw new Error('Offer Recipient must be difened');
		if (typeof data.id === 'undefined') data.id = this.newID();
		if (typeof data.created === 'undefined') data.created = new Date();
		this.collector = Collector;
		this.id = data.id;
		this.initiator = new TradeUser(Collector, data.initiator);
		this.recipient = new TradeUser(Collector, data.recipient);
		this.created = new Date(data.created);
	}

	newID()
	{
		return Random.string(4, 'abcdefghijklmnopqrstuvwxyz0123456789');
	}

	get count()
	{
		return this.initiator.offers.size + this.recipient.offers.size;
	}

	get benefits()
	{
		let betterCollection = this.initiator.offers.qualityCompare(this.recipient.offers);
		if (betterCollection === null) return null;
		if (betterCollection === this.initiator.offers) return this.recipient.user;
		if (betterCollection === this.recipient.offers) return this.initiator.user;
		return null;
	}

	addOffers(who, ids)
	{
		for (let id of ids)
		{
			id = this.collector.utils.formatCardID(id);
			let card = this.collector.cards.get(id);
			if (!card || card.untradable) continue;
			this[who].offers.add(id);
		}
		for (let [card, count] of this[who].offers)
		{
			if (this[who].user.cards.has(card, count)) continue;
			this[who].offers.remove(card, (count - this[who].user.cards.get(card)));
		}
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
		data.created = this.created.getTime();
		return data;
	}

	toJSON()
	{
		return JSON.stringify(this.compress());
	}

	details()
	{
		let benefits = this.benefits;
		let lines = [];
		lines.push(`**Trade ID:** ${this.id}`);
		lines.push(`**Initiator:** ${this.initiator}`);
		lines.push(`**Recipient:** ${this.recipient}`);
		if (benefits) lines.push(`__*Trade benefits ${benefits}*__`);
		lines.push('');
		lines.push('**~~----------------~~[ Offers ]~~----------------~~**');
		lines.push(`${this.initiator.offers}`);
		lines.push('');
		lines.push('**~~----------------~~[ Requests ]~~----------------~~**');
		lines.push(`${this.recipient.offers}`);
		return lines.join('\n');
	}
	
	toString()
	{
		return this.details();
	}

	save()
	{
		this.collector.trades.save(this);
	}
}