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
				description: 'View information about a specific card.',
				details: 'View information about a card such as what set the card belongs to, the card\'s rarity, if you\'ve collected the card yet, and if you have collected the card more details will be shown.',
				args: [Collector.utils.args.cardID]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		args.cardID = this.collector.utils.formatCardID(args.cardID);
		let card = this.collector.registry.cards.get(args.cardID);
		if (typeof card === 'undefined')
		{
			message.reply(`Unable to find Card: \`${args.cardID}\``);
			return;
		}
		let user = this.collector.users.get(message.author);
		let owned = user.cards.has(card.id);
		let visible = card.visibility <= 0;
		if (card.visibility > 1 && !(owned || visible))
		{
			message.reply(`Unable to find Card: \`${args.cardID}\``);
			return;
		}

		let description = '';
		description = '**Card:** ';
		if (visible || owned) description += `${card.title} \`${card.id}\``;
		else description += `????? \`${card.id}\``;
		description += `\n**Set:** ${card.set.title} \`${card.set.id}\``;
		description += '\n';
		description += `\n**Rarity:** ${card.rarity}`;
		description += '\n**Collected:** ';
		if (owned) description += '`✔️`' + user.cards.get(card.id);
		else description += '`❌`';
		if (card.author) description += `\n**Author:** <@${card.author}>`;
		if (visible || owned)
		{
			if (card.tags.length > 0)
			{
				description += '\n**Tags:** '
				for (let tag of card.tags)
				{
					description += `\`${tag}\`, `;
				}
				description = description.replace(/, $/g, '');
			}
			if (card.source) description += `\n**Source:** ${card.source}`;
			if (card.description) description += `\n${card.description}`;
		}

		let footer = '';
		if (card.guarded) footer += 'Guarded ';
		if (card.untradable) footer += 'Untradable ';
		footer = footer.replace(/ $/g, '');

		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		embed.setFooter(footer);
		message.channel.send(embed);
	}
}