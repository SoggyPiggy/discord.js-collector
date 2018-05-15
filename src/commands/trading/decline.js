const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'decline',
				group: 'collector_trading',
				memberName: 'decline',
				description: 'Decline/Cancel a trade',
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
		trade.decline();
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Trade Canceled');
		embed.setDescription(trade.details({user, collected: false}));
		message.channel.send(embed);
		let other;
		if (user.id === trade.initiator.user.id) other = await this.client.users.fetch(trade.recipient.user.id);
		else other = await this.client.users.fetch(trade.initiator.user.id);
		embed.setDescription(trade.details({user: this.collector.users.get(this.collector.users.get(other)), collected: false}));
		other.send(embed);
	}
}