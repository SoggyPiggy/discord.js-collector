const ChanceMap = require('./../utils/ChanceMap');

module.exports = class Set
{
	constructor(data = {})
	{
		if (typeof data					!== 'object')		throw new Error('Set data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error('Set missing ID');
		if (typeof data.series			=== 'undefined')	throw new Error(`Set ${data.id} missing Series ID`);
		if (typeof data.title			=== 'undefined')	data.title			= 'undefined';
		if (typeof data.author			=== 'undefined')	data.author			= null;
		if (typeof data.description	=== 'undefined')	data.description	= null;
		if (typeof data.tags				=== 'undefined')	data.tags			= [];
		if (typeof data.chance			=== 'undefined')	data.chance			= 100;
		if (typeof data.visibility		=== 'undefined')	data.visibility	= 1;
		if (typeof data.purchasable	=== 'undefined')	data.purchasable	= true;
		if (typeof data.obtainable		=== 'undefined')	data.obtainable	= true;
		if (typeof data.guarded			=== 'undefined')	data.guarded		= false;
		if (typeof data.untradable		=== 'undefined')	data.untradable	= false;
		if (typeof data.omit				=== 'undefined')	data.omit			= false;

		this.id				= data.id;
		this.series			= data.series;
		this.title			= data.title;
		this.chance			= data.chance;
		this.author			= data.author;
		this.description	= data.description;
		this.tags			= data.tags;
		this.visibility	= data.visibility;
		this.purchasable	= data.purchasable;
		this.obtainable	= data.obtainable;
		this.guarded		= data.guarded;
		this.untradable	= data.untradable;
		this.omit			= data.omit;
		this.cards			= new ChanceMap();

		for (let p in data)
		{
			if (typeof this[p] === 'undefined') this[p] = data[p];
		}
	}

	get value()
	{
		return (((this.series.all._total / this.series.all.size) / this.chance) * this.series.value);
	}

	owned(user)
	{
		let owned = [];
		for (let [key, card] of this.cards)
		{
			if (user.cards.has(key)) owned.push(card);
		}
		return owned;
	}

	compress()
	{
		let data = {};
		data.id = this.id;
		data.series = this.series.compress();
		data.title = this.title;
		data.chance = this.chance;
		data.author = this.author;
		data.description = this.description;
		data.tags = this.tags;
		data.visibility = this.visibility;
		data.purchasable = this.purchasable;
		data.obtainable = this.obtainable;
		data.guarded = this.guarded;
		data.untradable = this.untradable;
		data.omit = this.omit;
		return data;
	}
}