class CardCollection extends Map
{
	constructor(cards)
	{
		super(cards);
	}

	add(id, count = 1)
	{
	}

	remove(id, count = 1)
	{
		if (this.has(id))
		{
			let num = Number(this.get(id)) - count;
			if (num > 0) this.set(id, num);
			else this.delete(id);
		}
	}

	compress()
	{
		let compression = [];
		for (let key of this.keys())
		{
			compression.push([key, this.get(key)]);
		}
		return compression;
	}
}