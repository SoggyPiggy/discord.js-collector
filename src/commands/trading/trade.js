const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'trade-info',
				aliases: ['trade', 't'],
				group: 'collector_trading',
				memberName: 'trade',
				description: 'Create a trade of cards with someone.',
				args:
				[
					{
						key: 'tradeID',
						label: 'Trade ID',
						prompt: 'What is the ID of the trade you would like to look at?',
						type: 'string',
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user = this.collector.users.get(message.author, false);
		if (!user) return message.reply('You do not have any trades');
		if (user.trades.size <= 0) return message.reply('You do not have any trades');
		let tradeID = this.collector.utils.formatID(args.tradeID);
		let trade = user.trades.get(tradeID);
		if (!trade) return message.reply(`Unable to find Trade: \`${tradeID}\``);
		let embed = new Discord.MessageEmbed();
		embed.setDescription(trade.details({user, collected: false}));
		embed.setTitle('Trade Details');
		message.channel.send(`${user}`, embed);
	}
}