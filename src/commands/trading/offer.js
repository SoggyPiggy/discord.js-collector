const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const Trade = require('./../../structures/Trade');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'offer-trade',
				aliases: ['offer'],
				group: 'collector_trading',
				memberName: 'offer',
				description: 'Create a trade of cards with someone',
				args:
				[
					{
						key: 'cardIDsI',
						label: 'Card ID (Offer)',
						prompt: 'What are the IDs of the cards you\'re offering?\nIf there are multiple seperate with spaces.\nType \'!\' to add nothing.',
						type: 'string',
					},
					{
						key: 'member',
						label: 'User',
						prompt: 'Who would you like to trade with?',
						type: 'user'
					},
					{
						key: 'cardIDsR',
						label: 'Card ID (Request)',
						prompt: 'What are the IDs of the cards you\'re requesting?\nIf there are multiple seperate with spaces.\nType \'!\' to add nothing.',
						type: 'string',
					},
					{
						key: 'quickconfirm',
						label: 'Quick Confirmation',
						prompt: 'To quickly confirm the trade on the same line.',
						type: 'boolean',
						default: false
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let initiator = this.collector.users.get(message.author, false);
		if (!initiator) return message.reply('You do not have any cards.');
		let recipient = this.collector.users.get(args.member, false);
		if (!recipient) return message.reply(`${args.member} does not have any cards.`);
		if (initiator.id === recipient.id) return message.reply('You can not trade yourself');
		let confirmation = args.quickconfirm;
		
		args.cardIDsI = args.cardIDsI.split(' ').filter(item => item !== '!');
		args.cardIDsR = args.cardIDsR.split(' ').filter(item => item !== '!');
		let trade = new this.collector.structures.Trade(this.collector, {initiator, recipient});
		trade.addOffers('initiator', args.cardIDsI);
		trade.addOffers('recipient', args.cardIDsR);
		if (trade.count <= 0) return message.reply('You have to specify cards either of you own to trade.');

		let embed = new Discord.MessageEmbed();
		embed.setTitle('Trade Details');
		embed.setDescription(trade.details({user: initiator, collected: false}));
		message.channel.send(embed);

		if (!confirmation) confirmation = await this.collector.utils.addConfirmation(message, args, 'Confirm Trade');
		if (!confirmation) return message.reply('Trade Canceled');
		let id = trade.id;
		while (this.collector.trades.has(trade.id))
		{
			trade.id = trade.newID();
		}
		this.collector.trades.set(trade.id, trade);
		initiator.trades.set(trade.id, trade);
		recipient.trades.set(trade.id, trade);
		trade.save();
		if (id !== trade.id) message.reply(`**Trade ID conflict!**\nTrade ID is now: \`${trade.id}\`\nTrade request completed.`);
		else message.reply('Trade request completed.');
		embed.setDescription(trade.details({user: recipient, collected: false}));
		args.member.send(`${initiator} has made a trade offer.\nYou can use the \`accept\` or \`decline\` command to respond to the offer.`, embed);
		this.collector.emit('tradeRequested', trade, initiator, recipient);
	}
}