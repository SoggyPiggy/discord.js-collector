const ChanceMap = require('./../utils/ChanceMap');

module.exports = class Set
{
	constructor(options = {})
	{
		if (typeof options					!== 'object')		throw new Error('Set data must be an object');
		if (typeof options.id				=== 'undefined')	throw new Error('Set missing ID');
		if (typeof options.series			=== 'undefined')	throw new Error('Set missing Series ID');
		if (typeof options.title			=== 'undefined')	options.title			= 'undefined';
		if (typeof options.author			=== 'undefined')	options.author			= null;
		if (typeof options.description	=== 'undefined')	options.description	= null;
		if (typeof options.tags				=== 'undefined')	options.tags			= [];
		if (typeof options.chance			=== 'undefined')	options.chance			= 100;
		if (typeof options.visibility		=== 'undefined')	options.visibility	= 1;
		if (typeof options.purchasable	=== 'undefined')	options.purchasable	= true;
		if (typeof options.obtainable		=== 'undefined')	options.obtainable	= true;
		if (typeof options.guarded			=== 'undefined')	options.guarded		= false;
		if (typeof options.untradable		=== 'undefined')	options.untradable	= false;
		if (typeof options.omit				=== 'undefined')	options.omit			= false;

		this.id				= options.id;
		this.series			= options.series;
		this.title			= options.title;
		this.chance			= options.chance;
		this.author			= options.author;
		this.description	= options.description;
		this.tags			= options.tags;
		this.visibility	= options.visibility;
		this.purchasable	= options.purchasable;
		this.obtainable	= options.obtainable;
		this.guarded		= options.guarded;
		this.untradable	= options.untradable;
		this.omit			= options.omit;
		this.cards			= new ChanceMap();
	}

	get value()
	{
		return (((this.series.all._total / this.series.all.size) / this.chance) * this.series.value);
	}

	ownedCards(user)
	{
		let owned = [];
		for (let [key, card] of this.cards)
		{
			if (user.cards.has(key)) owned.push(card);
		}
		return owned;
	}
}