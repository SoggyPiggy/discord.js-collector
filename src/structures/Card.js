module.exports = class Card
{
	constructor(data = {})
	{
		if (typeof data					!== 'object')		throw new Error('Card data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error('Card missing ID');
		if (typeof data.set				=== 'undefined')	throw new Error(`Card ${data.id} missing Set`);
		if (typeof data.$set				=== 'undefined')	data.$set			= data.set;
		if (typeof data.title			=== 'undefined')	data.title			= 'undefined';
		if (typeof data.rarity			=== 'undefined')	data.rarity			= 'undefined';
		if (typeof data.source			=== 'undefined')	data.source			= null;
		if (typeof data.description	=== 'undefined')	data.description	= null;
		if (typeof data.tags				=== 'undefined')	data.tags			= [];
		if (typeof data.author			=== 'undefined')	data.author			= null;
		if (typeof data.xp				=== 'undefined')	data.xp				= 100;
		if (typeof data.chance			=== 'undefined')	data.chance			= 100;
		if (typeof data.visibility		=== 'undefined')	data.visibility	= -Infinity;
		if (typeof data.guarded			=== 'undefined')	data.guarded		= false;
		if (typeof data.untradable		=== 'undefined')	data.untradable	= false;
		if (typeof data.omit				=== 'undefined')	data.omit			= false;
		
		this.id				= data.id;
		this.set				= data.set;
		this.$set			= data.$set;
		this.title			= data.title;
		this.rarity			= data.rarity;
		this.source			= data.source;
		this.description	= data.description;
		this.tags			= data.tags;
		this.author			= data.author;
		this.xp				= data.xp;
		this.chance			= data.chance;
		this.visibility	= data.visibility;
		this.guarded		= data.guarded;
		this.untradable	= data.untradable;
		this.omit			= data.omit;

		for (let p in data)
		{
			if (typeof this[p] === 'undefined') this[p] = data[p];
		}
	}

	get value()
	{
		return (((this.$set.cards._total / this.$set.cards.size) / this.chance) * this.$set.value);
	}

	inheritProperties()
	{
		if (this.author === null && this.$set.author !== null) this.author = this.$set.author;
		if (this.visibility < this.$set.visibility) this.visibility = this.$set.visibility;
		if (this.$set.guarded === true) this.guarded = true;
		if (this.$set.untradable === true) this.untradable = true;
		for (let tag of this.$set.tags)
		{
			if (!this.tags.includes(tag)) this.tags.push(tag);
		}
	}

	owned(user)
	{
		if (user.cards.has(this.id)) return user.cards.get(this.id);
		else return false;
	}

	compress()
	{
		let data = {};
		data.id = this.id;
		data.set = this.set.compress();
		data.title = this.title;
		data.rarity = this.rarity;
		data.source = this.source;
		data.description = this.description;
		data.tags = this.tags;
		data.author = this.author;
		data.xp = this.xp;
		data.chance = this.chance;
		data.visibility = this.visibility;
		data.image = this.image;
		data.fullart = this.fullart;
		data.guarded = this.guarded;
		data.untradable = this.untradable;
		data.omit = this.omit;
		return data;
	}
}