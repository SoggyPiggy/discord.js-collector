module.exports = class CardCollection extends Map
{
	constructor(collector, cards)
	{
		for (let card of cards)
		{
			card[0] = collector.utils.formatCardID(card[0]);
		}
		super(cards);
		this.collector = collector;
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
		return this.size;
	}

	qualityCompare(collection)
	{
		if (this.size === 0 && collection.size === 0) return null;
		if (this.size !== 0 && collection.size === 0) return this;
		if (this.size === 0 && collection.size !== 0) return collection;
		let infinites = {this: 0, collection: 0};
		let totals = {this: 0, collection: 0};
		for (let [id, count] of this)
		{
			let card = this.collector.cards.get(id);
			if (!card) continue;
			let value = card.value;
			if (value === Infinity) infinites.this++;
			else totals.this += value;
		}
		for (let [id, count] of collection)
		{
			let card = collection.collector.cards.get(id);
			if (!card) continue;
			let value = card.value;
			if (value === Infinity) infinites.collection++;
			else totals.collection += value;
		}
		if (infinites.this > infinites.collection) return this;
		if (infinites.this < infinites.collection) return collection;
		if (totals.this > totals.collection) return this;
		if (totals.this < totals.collection) return collection;
		return null;
	}

	quality(infinityCheck = true)
	{
		if (this.size === 0) return 0;
		let quality = 0;
		let total = 0;
		for (let [id, count] of this)
		{
			let card = this.collector.cards.get(id);
			if (!card) continue;
			if (infinityCheck && card.value === Infinity) continue;
			quality += (count * card.value);
			total += count;
		}
		return quality / total;
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

	header(options = {})
	{
		if (typeof options.total === 'undefined') options.total = this.total;
		if (typeof options.unique === 'undefined') options.unique = this.unique;
		let lines = [];
		lines.push(`**Total Cards: ${options.total}`);
		lines.push(`**Unique Cards: ${options.unique}`);
		return lines.join('\n');
	}

	details(options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.count === 'undefined') options.count = String(Math.max(Array.from(this.values()))).replace(/./g, '0').padStart(2, '0');
		let lines = [];
		for (let [id, value] of this)
		{
			let card = this.collector.lines.get(id) || id;
			lines.push(discordJSCollector.Card.line(card, options, value));
		}
		if (lines.length) return lines.join('\n');
		return '__*Nothing*__';
	}

	toString()
	{
		return this.details();
	}
}