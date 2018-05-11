const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'offers',
				group: 'collector_trading',
				memberName: 'offers',
				description: 'offers',
				args:
				[
					{
						key: 'page',
						label: 'Page Number / Filter',
						prompt: 'Which page would you like to view? or what filters would you like to apply?',
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
		let user = this.collector.users.get(message.author, false);
		if (!user) return message.reply('You do not have any trades.');
		if (user.trades.size <= 0) return message.reply('You do not have any trades.');
		let page = 1;
		let filter = '';
		if (typeof args.page === 'number') page = args.page;
		else if (typeof args.page === 'string') filter = args.page + ' ';
		if (args.filters) filter += args.filters;
		let handler = new this.collector.utils.OfferHandler(this.collector, {user});
		handler.applyFilters(filter);
		handler.sort();
		let description = handler.list(page);
		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		message.channel.send(`${user}`, embed);
	}
}