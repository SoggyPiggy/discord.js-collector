const Commando = require('discord.js-commando');
const CardCollection = require('./../structures/CardCollection');
const Trade = require('./../structures/Trade');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'trade',
				group: 'collector_trading',
				memberName: 'trade',
				description: 'Create a trade of cards with someone.',
				args:
				[
					{
						key: 'cardIDsO',
						label: 'Card IDs (Offers)',
						prompt: 'What are the IDs of the cards you\'re offering?\nIf there are multiple seperate with spaces.\nType \'skip\' to add nothing.',
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
						label: 'Card IDs (Requests)',
						prompt: 'What are the IDs of the cards you\'re requesting?\nIf there are multiple seperate with spaces.\nType \'skip\' to add nothing.',
						type: 'string',
					},
					{
						key: 'confirm',
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

		args.cardIDsO = args.cardIDsO.split(' ');
		args.cardIDsR = args.cardIDsR.split(' ');
		let offers = new CardCollection(this.collector);
		let requests = new CardCollection(this.collector);
		for (let id of args.cardIDsO)
		{
			if (id.toLowerCase() === 'skip') continue;
			id = this.collector.utils.formatCardID(id);
			if (!this.collector.registry.cards.has(id)) continue;
			offers.add(id);
		}
		for (let id of args.cardIDsR)
		{
			if (id.toLowerCase() === 'skip') continue;
			id = this.collector.utils.formatCardID(id);
			if (!this.collector.registry.cards.has(id)) continue;
			requests.add(id);
		}
		for (let [card, count] of offers)
		{
			if (initiator.cards.has(card, count)) continue;
			let removal = count - initiator.cards.get(card);
			offers.remove(card, removal);
		}
		for (let [card, count] of requests)
		{
			if (recipient.cards.has(card, count)) continue;
			let removal = count - recipient.cards.get(card);
			offers.remove(card, removal);
		}
		if (requests.length <= 0 && offers.length <= 0) return message.reply('You have to specify cards either of you own to trade.');
		let trade = new Trade(this.collector, {})
	}
}