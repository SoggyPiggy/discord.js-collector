const ChanceMap = require('./../utils/ChanceMap');

module.exports = class
{
	constructor(data = {}, registry)
	{
		if (typeof data					!== 'object')		throw new Error('Series data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error(`Series ${data.id} missing ID`);
		if (typeof data.chance			=== 'undefined')	data.chance			= 100;
		if (typeof data.collectable	=== 'undefined')	data.collectable	= true;
		if (typeof data.packable		=== 'undefined')	data.packable		= true;
		if (typeof data.mutatable		=== 'undefined')	data.mutatable		= true;

		this.id				= data.id;
		this.chance			= data.chance;
		this.collectable	= data.collectable;
		this.packable		= data.packable;
		this.mutatable		= data.mutatable;
		this.sets			= new ChanceMap;
		this.all				= new ChanceMap;
		this.registry		= registry;

		for (let p in data)
		{
			if (typeof this[p] === 'undefined') this[p] = data[p];
		}
	}

	get value()
	{
		let total = 0;
		let count = 0;
		if (this.collectable)
		{
			let average = this.registry.allCollectable._total / this.registry.allCollectable.size
			total += ((average / this.chance) / (average / this.registry.allCollectable._min));
			count ++;
		}
		if (this.mutatable)
		{
			let average = this.registry.allMutatable._total / this.registry.allMutatable.size
			total += ((average / this.chance) / (average / this.registry.allMutatable._min));
			count++;
		}
		if (this.packable)
		{
			let average = this.registry.allPackable._total / this.registry.allPackable.size
			total += ((average / this.chance) / (average / this.registry.allPackable._min));
			count++;
		}
		let value = (total / count);
		if (isNaN(value)) return Infinity;
		else return value;
	}

	compress()
	{
		let data = {};
		data.id = this.id;
		data.chance = this.chance;
		data.collectable = this.collectable;
		data.packable = this.packable;
		data.mutatable = this.mutatable;
		return data;
	}
}