module.exports = class CardCollection extends Map
{
	constructor(cards)
	{
		super(cards);
	}

	add(card, count = 1)
	{
		let id = this.parseID(card);
		let num;
		if (this.has(id)) num = this.get(id) + count;
		else num = count;
		this.set(id, num);
	}

	remove(card, count = 1)
	{
		let id = this.parseID(card);
		if (this.has(id))
		{
			let num = this.get(id) - count;
			if (num > 0) this.set(id, num);
			else this.delete(id);
		}
	}

	parseID(card)
	{
		if (typeof card === 'string') return card;
		else if (typeof card.id !== 'undefined') return card.id;
	}

	compress()
	{
		let data = [];
		for (let key of this.keys())
		{
			data.push([String(key), Number(this.get(key))]);
		}
		return data;
	}
}