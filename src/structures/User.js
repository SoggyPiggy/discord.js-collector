const CardCollection = require('./CardCollection');

module.exports = class User
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
		if (typeof data.starterpack === 'undefined') data.starterpack = false;

		this.collector = collector;
		this.id = data.id;
		this.username = data.username;
		this.credits = data.credits;
		this.xp = data.xp;
		this.cooldowns = new Map();
		this.cooldowns.set('collect', new collector.utils.Cooldown({ min: collector.options.collectMinCooldown, max: collector.options.collectMaxCooldown, cooldown: data.cooldowns.collect.cooldown}));
		this.cards = new CardCollection(collector, data.cards);
		this.starterpack = data.starterpack;
	}

	get level()
	{
		if (typeof this.collector.options.levelXP === 'function') return this.collector.options.levelXP(this.xp);
		return Math.floor(this.xp / this.collector.options.levelXP)
	}

	giveXP(xp = 0)
	{
		let levelOld = this.level;
		this.xp += xp;
		let levelNew = this.level;
		let credits;
		if (typeof this.collector.options.levelCredits === 'function') credits = this.collector.options.levelCredits(levelNew - levelOld, levelNew, levelOld);
		else credits = this.collector.options.levelCredits * (levelNew - levelOld);
		this.credits += credits;
	}

	save()
	{
		this.collector.users.save(this);
	}

	compress()
	{
		let data = {};
		data.id = String(this.id);
		data.username = String(this.username);
		data.credits = Number(this.credits);
		data.xp = Number(this.xp);
		data.cooldowns = {};
		for (let v of this.cooldowns.keys())
		{
			data.cooldowns[v] = this.cooldowns.get(v).compress();
		}
		data.cards = this.cards.compress();
		return data;
	}
}