module.exports = class Card
{
	constructor(data = {})
	{
		if (typeof data					!== 'object')		throw new Error('Card data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error('Card missing ID');
		if (typeof data.set				=== 'undefined')	throw new Error('Card missing Set');
		if (typeof data.title			=== 'undefined')	data.title			= 'undefined';
		if (typeof data.rarity			=== 'undefined')	data.rarity			= 'undefined';
		if (typeof data.xp				=== 'undefined')	data.xp				= 100;
		if (typeof data.chance			=== 'undefined')	data.chance			= 100;
		if (typeof data.source			=== 'undefined')	data.source			= null;
		if (typeof data.description	=== 'undefined')	data.description	= null;
		if (typeof data.tags				=== 'undefined')	data.tags			= data.set.tags;
		if (typeof data.author			=== 'undefined')	data.author			= data.set.author;
		if (typeof data.image			=== 'undefined')	data.image			= null;
		if (typeof data.fullart			=== 'undefined')	data.fullart		= false;
		if (typeof data.guarded			=== 'undefined')	data.guarded		= false;
		if (typeof data.untradable		=== 'undefined')	data.untradable	= false;
		
		this.id				= data.id;
		this.set				= data.set;
		this.title			= data.title;
		this.xp				= data.xp;
		this.rarity			= data.rarity;
		this.chance			= data.chance;
		this.source			= data.source;
		this.description	= data.description;
		this.tags			= data.tags;
		this.image			= data.image;
		this.fullart		= data.fullart;
		this.guarded		= data.guarded;
		this.untradable	= data.untradable;
	}
}