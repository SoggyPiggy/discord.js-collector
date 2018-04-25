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
				description: 'View a render of a card.',
				args: [Collector.utils.args.cardID]
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
		let owned = user.cards.has(card.id);
		let visible = card.visibility <= 0;
		if (card.visibility > 1 && !(owned || visible))
		{
			message.reply(`Unable to find Card: \`${cardID}\``);
			return;
		}

		let response = `<@${user.id}> Rendering \`${card.id}\` **${card.title}** *${card.rarity}*`;
		let reply = message.channel.send(response)
		try
		{
			let style = this.collector.cardstyles.get();
			let buffer = await style.render({card: card});
			if (!buffer) throw new Error('Unable to render');

			let attachment = new Discord.MessageAttachment();
			attachment.setFile(buffer);
			attachment.setName('Card.png');
			reply = await reply
			await message.channel.send(response, attachment);
			reply.delete();
		}
		catch(error)
		{
			reply = await reply;
			reply.edit(`${response}\nUnable to render the card`);
			this.collector.emit('warn', error.message);
		}
	}
}