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
	}

	get value()
	{
		let total = 0;
		let count = 0;
		if (this.collectable)
		{
			total += ((this.registry.allCollectable._total / this.registry.allCollectable.size) / this.chance);
			count ++;
		}
		if (this.mutatable)
		{
			total += ((this.registry.allMutatable._total / this.registry.allMutatable.size) / this.chance);
			count ++;
		}
		if (this.packable)
		{
			total += ((this.registry.allPackable._total / this.registry.allPackable.size) / this.chance);
			count ++;
		}
		if (total === 0) return 0;
		else return (total / count);
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