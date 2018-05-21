const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'upgrades',
				aliases: ['upgrade-search', 'u-search'],
				group: 'collector_store',
				memberName: 'upgrades',
				description: 'View/Search through the list of upgrades',
				details: 'View the list of all the upgrades. With extra arguments you can search through all the upgrades and select which page you would like to view.\nYou can use the help command to read more about searching.',
				args:
				[
					{
						key: 'page',
						label: 'Page Number / Filter',
						prompt: 'Which page would you like to view? or what fisters would you like to apply?',
						type: 'integer|string',
						default: 1
					},
					{
						key: 'filters',
						label: 'Filter(s)',
						prompt: 'What filters would you like to apply?',
						type: 'string',
						default: false
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let page = 1;
		let filter = '';
		if (typeof args.page === 'number') page = args.page;
		else if (typeof args.page === 'string') filter = args.page + ' ';
		if (args.filters) filter += args.filters;
		let user = this.collector.users.get(message.author);
		let handler = new this.collector.utils.UpgradeHandler(this.collector, {user: user});
		handler.applyFilters(filter);
		handler.sort();
		let description = handler.list(page);
		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		let reply = message.channel.send(`${user}`, embed);
	}
}