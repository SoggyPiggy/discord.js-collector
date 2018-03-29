module.exports =
{
	Client: require('./src/Collector'),
	Card: require('./src/structures/Card'),
	Set: require('./src/structures/Set'),

	visibility: {NORMAL: 1, HIDDEN: 2, INVISIBLE: 3},
	version: require('./package').version,
}