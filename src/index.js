module.exports =
{
	Client: require('./Collector'),
	Card: require('./structures/Card'),
	Set: require('./structures/Set'),
	CardStyle: require('./structures/CardStyle'),
	Upgrade: require('./structures/Upgrade'),
	Util: require('./Utils'),

	visibility: {OPEN: 0, NORMAL: 1, HIDDEN: 2, INVISIBLE: 3},
	version: require('./../package').version,
}