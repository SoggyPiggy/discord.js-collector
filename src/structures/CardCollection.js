module.exports = class CardCollection extends Map
{
	constructor(collector, cards)
	{
		for (let card of cards)
		{
			card[0] = collector.utils.formatCardID(card[0]);
		}
		super(cards);
	}

	get total()
	{
		let total = 0;
		for (let [key, value] of this)
		{
			total += value;
		}
		return total;
	}

	get unique()
	{
		return this.length;
	}

	has(card, count = 1)
	{
		let id = this.parseID(card);
		if (count === 1) return super.has(id);
		if (super.has(id) && count > 1)
		{
			return this.get(id) >= count;
		}
		return false;
	}

	get(card)
	{
		let id = this.parseID(card);
		return super.get(id);
	}

	add(card, count = 1)
	{
		let id = this.parseID(card);
		if (super.has(id)) this.set(id, super.get(id) + count);
		else this.set(id, count);
	}

	remove(card, count = 1)
	{
		let id = this.parseID(card);
		if (this.has(id))
		{
			if (super.get(id) < count) count = super.get(id);
			let num = super.get(id) - count;
			if (num > 0) this.set(id, num);
			else this.delete(id);
			return count;
		}
		return 0;
	}

	parseID(card)
	{
		if (typeof card === 'string') return card;
		else if (typeof card.id !== 'undefined') return card.id;
	}

	compress()
	{
		let data = [];
		for (let [card, count] of this)
		{
			data.push([String(card), Number(count)]);
		}
		return data;
	}
}