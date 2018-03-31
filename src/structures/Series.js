const ChanceMap = require('./../utils/ChanceMap');

module.exports = class
{
	constructor(data = {}, registery)
	{
		if (typeof data					!== 'object')		throw new Error('Series data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error('Series missing ID');
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
		this.registery		= registery;
	}

	get value()
	{
		let total = 0;
		let count = 0;
		if (this.collectable)
		{
			total += (this.chance / this.registery.collectable._total);
			count ++;
		}
		if (this.mutatable)
		{
			total += (this.chance / this.registery.mutatable._total);
			count ++;
		}
		if (this.packable)
		{
			total += (this.chance / this.registery.packable._total);
			count ++;
		}
		if (total === 0) return 0;
		else return (total / count);
	}
}