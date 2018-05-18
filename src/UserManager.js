const Discord = require('discord.js');
const User = require('./structures/User');

module.exports = class UserManager extends Map
{
	constructor(collector)
	{
		super();
		this.collector = collector;
		this.collector.db.loadCollections(['users']);
		let users = this.collector.db.users.find();
		for (let user of users)
		{
			user = new User(collector, user);
			this.set(user.id, user);
		}
	}

	get(member, create = true)
	{
		let id = this.parseID(member);
		let user = super.get(id);
		if (typeof user === 'undefined')
		{
			if (!create) return;
			user = new User(this.collector, {id: id});
			this.set(user.id, user);
		}
		if (member instanceof Discord.User)
		{
			user.member = member;
			user.username = `${member.username}#${member.discriminator}`
		}
		return user
	}

	has(member)
	{
		let id = this.parseID(member);
		return super.has(id);
	}

	save(member)
	{
		let id = this.parseID(member);
		let user = this.get(id, false);
		if (!user) return;
		this.collector.db.users.update({id}, user.compress(), {upsert: true});
		this.collector.emit('userSaved', user)
	}

	parseID(member)
	{
		if (typeof member === 'string') return member;
		else if (typeof member.id !== 'undefined') return String(member.id);
	}
}