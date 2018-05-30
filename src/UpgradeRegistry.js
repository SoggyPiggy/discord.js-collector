const Upgrade = require('./structures/Upgrade');

module.exports = class UpgradeRegistry extends Map
{
	constructor(Collector)
	{
		super();
		this.collector = Collector;
	}

	registerUpgrade(upgrade)
	{
		if (typeof upgrade === 'undefined') return;
		if (typeof upgrade === 'function') upgrade = new upgrade();
		if (!(upgrade instanceof Upgrade)) return;
		upgrade.id = this.collector.utils.formatID(upgrade.id);
		if (this.has(upgrade.id)) return this.collector.emit('error', upgrade, this);
		upgrade.init(this.collector);
		this.set(upgrade.id, upgrade);
		this.runStartup(upgrade);
	}

	runStartup(upgrade)
	{
		for (let [id, user] of this.collector.users)
		{
			upgrade.startup(user);
		}
	}
}