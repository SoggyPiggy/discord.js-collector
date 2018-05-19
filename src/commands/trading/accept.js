const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'accept-trade',
				aliases: ['accept'],
				group: 'collector_trading',
				memberName: 'accept',
				description: 'Accept a trade you are the recipient to',
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
		if (user.id !== trade.recipient.user.id) return message.reply(`You can't accept a trade if you are not the recipient`);
		let embed = new Discord.MessageEmbed();
		let passed = trade.complete()
		if (passed !== true)
		{
			embed.setTitle('Trade Failed');
			embed.setDescription(passed);
		}
		else
		{
			embed.setTitle('Trade Completed');
			embed.setDescription(trade.details());
		}
		message.channel.send(embed);
		let initiator = await this.client.users.fetch(trade.initiator.user.id);
		initiator.send(embed);
		this.collector.emit('tradeAccepted', {user, message, args}, trade);
		if (passed !== true) this.collector.emit('tradeAcceptedPassed', {user, message, args}, trade, passed);
		else this.collector.emit('tradeAcceptedFailed', {user, message, args}, trade);
	}
}