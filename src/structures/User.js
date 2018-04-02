const Cooldown = require('./../utils/Cooldown');
const CardCollection = require('./CardCollection');

class User
{
	constructor(collector, data)
	{
		if (typeof data.id === 'undefined') throw new Error('User needs an id');
		if (typeof data.username === 'undefined') data.username = null;
		if (typeof data.credits === 'undefined') data.credits = 0;
		if (typeof data.xp === 'undefined') data.xp = 0;
		if (typeof data.cooldowns === 'undefined') data.cooldowns = {};
		if (typeof data.cooldowns.collect === 'undefined') data.cooldowns.collect = {};
		if (typeof data.cooldowns.collect.cooldown === 'undefined') data.cooldowns.collect.cooldown = 0;
		if (typeof data.cards === 'undefined') data.cards = [];

		this.collector = collector;
		this.id = data.id;
		this.username = data.username;
		this.credits = data.credits;
		this.xp = data.xp;
		this.cooldowns = new Map();
		this.cooldowns.set('collect', new Cooldown({ min: collector.options.collectMinCooldown, max: collector.options.collectMaxCooldown, cooldown: data.cooldowns.collect.cooldown}));
		this.cards = new CardCollection(data.cards);
	}

	get level()
	{
		return (this.xp / this.collector.options.levelXP)
	}

	compress()
	{
		let data = {};
		data.id = this.id;
		data.username = this.username;
		data.credits = this.credits;
		data.xp = this.xp;
		data.cooldowns = {};
		for (let v of this.cooldowns.keys())
		{
			data.cooldowns[v] = this.cooldowns.get(v).compress();
		}
		data.cards = this.cards.compress();
	}
}