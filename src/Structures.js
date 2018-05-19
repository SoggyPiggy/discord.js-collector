structures =
{
	Card: require('./structures/Card'),
	CardCollection: require('./structures/CardCollection'),
	UserUpgrades: require('./structures/UserUpgrades'),
	CardStyle: require('./structures/CardStyle'),
	Series: require('./structures/Series'),
	Set: require('./structures/Set'),
	Trade: require('./structures/Trade'),
	Upgrade: require('./structures/Upgrade'),
	User: require('./structures/User'),
}
module.exports = structures;
global.discordJSCollector = structures;