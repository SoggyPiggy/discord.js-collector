module.exports =
{
	Client: require('./Collector'),
	Card: require('./structures/Card'),
	Set: require('./structures/Set'),
	CardStyle: require('./structures/CardStyle'),

	util: require('./utils/Utils'),
	visibility: {OPEN: 0, NORMAL: 1, HIDDEN: 2, INVISIBLE: 3},
	version: require('./../package').version,
}