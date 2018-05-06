module.exports = class IDMap extends Map
{
	constructor(items)
	{
		super(items);
	}
	
	delete(item)
	{
		return super.delete(this.parseID(item));
	}
	
	get(item)
	{
		return super.get(this.parseID(item));
	}
	
	has(item)
	{
		return super.has(this.parseID(item));
	}
	
	set(key, item)
	{
		if (typeof key !== 'undefined')
		{
			if (typeof item !== 'undefined') return super.set(this.parseID(key), item);
			return super.set(this.parseID(key), key);
		}
		return super.set(key, item);
	}
	
	parseID(item)
	{
		if (typeof item === 'object') return item.id;
		return item;
	}

	compress()
	{
		return Array.from(this);
	}

	toJSON()
	{
		return JSON.stringify(this.compress());
	}
}