module.exports = class UserUpgrades extends Map
{
	constructor(Collector, upgrades)
	{
		super(upgrades);
		this.collector = Collector;
	}

	has(upgrade, level = 1)
	{
		let id = this.parseID(upgrade);
		if (level === 1) return super.has(id);
		if (super.has(id) && level > 1) return this.get(level) >= level;
		return false;
	}

	get(upgrade)
	{
		let id = this.parseID(upgrade);
		if (!super.has(id)) this.set(id, 0);
		return super.get(id);
	}

	add(card, level = 1)
	{
		let id = this.parseID(card);
		if (super.has(id)) this.set(id, super.get(id) + level);
		else this.set(id, level);
	}

	remove(card, level = 1)
	{
		let id = this.parseID(card);
		if (this.has(id))
		{
			if (super.get(id) < level) level = super.get(id);
			let num = super.get(id) - level;
			if (num > 0) this.set(id, num);
			else this.delete(id);
			return level;
		}
		return 0;
	}

	parseID(upgrade)
	{
		if (typeof upgrade === 'string') return upgrade;
		else if (typeof upgrade.id === 'object') return upgrade.id;
	}

	compress()
	{
		let data = [];
		for (let [upgrade, level] of this)
		{
			data.push([String(upgrade), Number(level)]);
		}
		return data;
	}
}