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
		for (let user of users)
		{
			let id = String(user.id);
			this.userDB.loadCollections([id]);
			let userData = this.userDB[id].find();
			if (typeof userData.id === 'undefined')
			{
				this.collector.emit('warn', `Attempting to register a User without ID: ${user}; skipping`);
				continue;
			}
			this.registerUser(new User(userData));
		}
	}

	registerUser(user)
	{
		this.set(user.id, user);
	}
}