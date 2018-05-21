const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'display',
				aliases: ['d'],
				group: 'collector_card',
				memberName: 'display',
				description: 'View a render of a card',
				args:
				[
					{
						key: 'cardID',
						label: 'Card ID',
						prompt: 'What is the ID of the card?',
						type: 'string'
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let cardID = this.collector.utils.formatCardID(args.cardID);
		let card = this.collector.registry.cards.get(cardID);
		if (typeof card === 'undefined') return message.reply(`Unable to find Card: \`${cardID}\``);
		let user = this.collector.users.get(message.author);
		let owned = user.cards.has(card.id) || 0;
		if (card.visibility >= 1 && !owned) return message.reply(`Unable to find Card: \`${cardID}\``);
		let reply = message.channel.send(`${user} Fetching your card \`${card.id}\` **${card.title}** *${card.rarity}*`)
		try
		{
			let style = this.collector.cardstyles.get(user.settings.get('cardstyle'));
			let buffer = await style.render({card: card});
			if (!buffer) throw new Error('Unable to render');
			let attachment = new Discord.MessageAttachment();
			attachment.setFile(buffer);
			attachment.setName('Card.png');
			reply = await reply
			await message.channel.send(`${user} \`${card.id}\` **${card.title}** *${card.rarity}*`, attachment);
			reply.delete();
		}
		catch(error)
		{
			reply = await reply;
			reply.edit(`${user} \`${card.id}\` **${card.title}** *${card.rarity}*\nUnable to render the card`);
			this.collector.emit('warn', error.message);
		}
	}
}