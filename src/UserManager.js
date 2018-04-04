const diskdb = require('diskdb');
const path = require('path');
const User = require('./structures/User');

module.exports = class UserManager extends Map
{
	constructor(collector)
	{
		super();
		this.collector = collector;
		this.db = diskdb.connect(path.join(collector.options.database), ['users']);
		this.userDB = diskdb.connect(path.join(collector.options.database, 'users'))

		let users = this.db.users.find();
		for (let p in users)
		{
			let id = this.parseID(users[p]);
			this.userDB.loadCollections([id]);
			let data = this.userDB[id].find();
			if (data.length <= 0)
			{
				this.userDB[id].update({id: id}, (this.get(id).compress()), {upsert: true});
				data = this.userDB[id].find()[0];
			}
			if (typeof data.id === 'undefined')
			{
				this.collector.emit('warn', `Attempting to register a User without ID: ${id}; skipping`);
				continue;
			}
			let user = new User(collector, data);
			this.set(user.id, user);
		}
	}

	get(member, create = true)
	{
		let id = this.parseID(member);
		let user = super.get(id);
		if (typeof user === 'undefined')
		{
			if (!create) return false;
			user = new User(this.collector, {id: id});
			this.set(user.id, user);
		}
		if (typeof member.username !== 'undefined') user.username = `${member.username}#${member.discriminator}`;
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
		if (user)
		{
			let updated = this.db.users.update({id, id}, {id, id}, {upsert: true});
			if (updated.inserted > 0) this.userDB.loadCollections([id]);
			this.userDB[id].update({id: id}, user.compress(), {upsert: true});
			this.collector.emit('debug', `User ${id} saved.`);
			this.collector.emit('userSaved', user)
		}
	}

	parseID(member)
	{
		if (typeof member === 'string') return member;
		else if (typeof member.id !== 'undefined') return String(member.id);
	}
}