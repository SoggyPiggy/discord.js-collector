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
		let average = this.$set.cards._total / this.$set.cards.size;
		let value = ((((average / this.chance) / (average / this.$set.cards._min)) + this.$set.value) / 2);
		if (isNaN(value)) return Infinity;
		else return value;
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
		if (user.cards.has(this.id)) return true;
		return false;
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

	details(owned = true, splitter = `\n`)
	{
		let items = [];
		if (this.visibility <= 0 || owned) items.push(`\`${this.id}\` **${this.title}**`);
		else items.push(`\`${this.id}\` ~~?????~~`);
		items.push(`\`${this.set.id}\` ${this.set.title}`);
		items.push(`**~~-----------------------------------------------~~**`)
		items.push(`**Rarity:** ${this.rarity}`);
		if (typeof owned === 'number')
		{
			if (owned) items.push(`**Collected:** \`✔️${owned}\``);
			else items.push('**Collected:** `❌`');
		}
		if (this.author) items.push(`**Author:** <@${this.author}>`);
		if (this.visibility <= 0 || owned)
		{
			if (this.tags.length > 0) items.push(`**Tags:** __${this.tags.join('__, __')}__`);
			if (this.source) items.push(`**Source:** ${this.source}`);
			if (this.description) items.push(`${this.description}`);
		}
		if (this.guarded || this.untradable)
		{
			let footers = [];
			if (this.guarded) footers.push(`Guarded`);
			if (this.untradable) footers.push('Untradable');
			items.push(`\`${footers.join('\` \`')}\``);
		}
		return items.join(splitter);
	}
	
	line(options = {}, owned = true)
	{
		return Card.line(this, options, owned);
	}
	
	static line(card, options = {}, count = true)
	{
		if (typeof card === 'string')
		{
			options = Object.assign({}, options);
			options.set = false;
			options.$set = false;
			options.rarity = false;
			return Card.line({id: card, title: '__Unavailable__'}, options, count);
		}
		if (typeof options.collected === 'undefined') options.collected = true;
		if (typeof options.count === 'undefined') options.count = '00';
		if (typeof options.id === 'undefined') options.id = true;
		if (typeof options.set === 'undefined') options.set = true;
		if (typeof options.$set === 'undefined') options.$set = false;
		if (typeof options.title === 'undefined') options.title = true;
		if (typeof options.rarity === 'undefined') options.rarity = true;
		if (typeof options.user !== 'undefined' && typeof count !== 'number') count = options.user.cards.get(card.id) || 0;
		let owned;
		if (options.user) owned = options.user.cards.has(card.id);
		else owned = Boolean(count);
		let lines = [];
		if (typeof count === 'number' && (options.collected || options.count))
		{
			let item = '`';
			if (options.collected) item += `${owned?'✔️':'❌'}`;
			if (options.count) item += `${count?`${String(count).padStart(options.count.length, '0')}`:`${options.count}`}`
			lines.push(item + '`');
		}
		if (options.id) lines.push(`\`${card.id}\``);
		if (options.set) lines.push(`\`${card.set.id}\``);
		if (options.$set) lines.push(`\`${card.$set.id}\``);
		if (options.title)
		{
			if (owned || card.visibility <= 0) lines.push(`**${card.title}**`);
			else lines.push(`~~**?????**~~`);
		}
		if (options.rarity)
		{
			if (owned || card.visibility <= 0) lines.push(`*${card.rarity}*`);
			else lines.push(`~~*?????*~~`);
		}
		return lines.join(' ');
	}

	toString()
	{
		return this.line({set: false});
	}
}