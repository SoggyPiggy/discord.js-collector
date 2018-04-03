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
			let id = String(users[p].id);
			this.userDB.loadCollections([id]);
			let data = this.userDB[id].find()[0];
			if (typeof data.id === 'undefined')
			{
				this.collector.emit('warn', `Attempting to register a User without ID: ${id}; skipping`);
				continue;
			}
			let user = new User(collector, data);
			this.set(user.id, user);
		}
	}
}