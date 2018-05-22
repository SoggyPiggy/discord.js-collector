module.exports =
{
	Client: require('./Collector'),
	Card: require('./structures/Card'),
	Set: require('./structures/Set'),
	CardStyle: require('./structures/CardStyle'),
	Upgrade: require('./structures/Upgrade'),
	Util: require('./Utils'),
	
	quickCard: options => class extends (require('./structures/Card')) { constructor() { super(options) } },
	quickSet: options => class extends (require('./structures/Set')) { constructor() { super(options) } },

	visibility: {OPEN: 0, NORMAL: 1, HIDDEN: 2, INVISIBLE: 3},
	version: require('./../package').version,
}