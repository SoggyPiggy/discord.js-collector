structures =
{
	Card: require('./structures/Card'),
	CardCollection: require('./structures/CardCollection'),
	CardStyle: require('./structures/CardStyle'),
	Series: require('./structures/Series'),
	Set: require('./structures/Set'),
	Trade: require('./structures/Trade'),
	User: require('./structures/User')
}
module.exports = structures;
global.discordJSCollector = structures;