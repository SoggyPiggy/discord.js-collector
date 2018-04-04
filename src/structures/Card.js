module.exports = class Card
{
	constructor(data = {})
	{
		if (typeof data					!== 'object')		throw new Error('Card data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error('Card missing ID');
		if (typeof data.set				=== 'undefined')	throw new Error('Card missing Set');
		if (typeof data.title			=== 'undefined')	data.title			= 'undefined';
		if (typeof data.rarity			=== 'undefined')	data.rarity			= 'undefined';
		if (typeof data.source			=== 'undefined')	data.source			= null;
		if (typeof data.description	=== 'undefined')	data.description	= null;
		if (typeof data.tags				=== 'undefined')	data.tags			= [];
		if (typeof data.author			=== 'undefined')	data.author			= null;
		if (typeof data.xp				=== 'undefined')	data.xp				= 100;
		if (typeof data.chance			=== 'undefined')	data.chance			= 100;
		if (typeof data.visibility		=== 'undefined')	data.visibility	= 1;
		if (typeof data.image			=== 'undefined')	data.image			= null;
		if (typeof data.fullart			=== 'undefined')	data.fullart		= false;
		if (typeof data.guarded			=== 'undefined')	data.guarded		= false;
		if (typeof data.untradable		=== 'undefined')	data.untradable	= false;
		if (typeof data.omit				=== 'undefined')	data.omit			= false;
		
		this.id				= data.id;
		this.set				= data.set;
		this.title			= data.title;
		this.rarity			= data.rarity;
		this.source			= data.source;
		this.description	= data.description;
		this.tags			= data.tags;
		this.author			= data.author;
		this.xp				= data.xp;
		this.chance			= data.chance;
		this.visibility	= data.visibility;
		this.image			= data.image;
		this.fullart		= data.fullart;
		this.guarded		= data.guarded;
		this.untradable	= data.untradable;
		this.omit			= data.omit;
	}

	get value()
	{
		return ((this.chance / this.set.cards._total) * this.set.value);
	}

	inheritProperties()
	{
		if (this.author === null && this.set.author !== null) this.author = this.set.author;
		if (this.visibility < this.set.visibility) this.visibility = this.set.visibility;
		if (this.set.guarded === true) this.guarded = true;
		if (this.set.untradable === true) this.untradable = true;
		for (let tag of this.set.tags)
		{
			if (!this.tags.includes(tag)) this.tags.push(tag);
		}
	}
}