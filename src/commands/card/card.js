const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'card-info',
				aliases: ['card', 'c'],
				group: 'collector_card',
				memberName: 'card-info',
				description: 'View information about a card',
				details: 'View card properties like the set it belongs to, rarity, if you\'ve collected the card, and more if you own the card.',
				args:
				[
					{
						key: 'cardID',
						label: 'Card ID',
						prompt: 'What is the ID of the card?',
						type: 'string',
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let cardID = this.collector.utils.formatCardID(args.cardID);
		let card = this.collector.registry.cards.get(cardID);
		if (typeof card === 'undefined')
		{
			message.reply(`Unable to find Card: \`${cardID}\``);
			return;
		}
		let user = this.collector.users.get(message.author);
		let owned = user.cards.get(card.id);
		if (card.visibility > 1 && !owned)
		{
			message.reply(`Unable to find Card: \`${cardID}\``);
			return;
		}
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Card Details')
		embed.setDescription(card.details(owned));
		message.channel.send(embed);
	}
}