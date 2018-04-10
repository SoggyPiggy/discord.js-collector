const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'set-info',
				aliases: ['set', 's'],
				group: 'collector_sets',
				memberName: 'set-info',
				description: 'View information about a set.',
				// details: 'Bah',
				args: [Collector.utils.args.setID, Collector.utils.args.page]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let setID = this.collector.utils.formatSetID(args.setID);
		let set = this.collector.registry.sets.get(setID);
		if (typeof set === 'undefined')
		{
			message.reply(`Unable to find Set: \`${setID}\``);
			return
		}
		if (set.visibility > 2)
		{
			message.reply(`Unable to find Set: \`${setID}\``);
			return
		}
		let user = this.collector.users.get(message.author);
		let cards = Array.from(set.cards.values());
		if (set.visibility > 1)
		{
			cards = set.ownedCards(user);
			if (cards.length <= 0)
			{
				message.reply(`Unable to find Set: \`${setID}\``);
				return;
			}
		}

		let description = `**Set:** ${set.title} \`${set.id}\``;
		cards = this.collector.utils.pagify(args.page, cards);
		description += `\n**Cards:**\n` + this.collector.utils.cardList(cards.results, user);
		description += `\n`;
		if (set.author) description += `\n**Author:** <@${set.author}>`
		if (set.tags > 0)
		{
			description += '\n**Tags:** '
			for (let tag of set.tags)
			{
				description += `\`${tag}\`, `;
			}
			description = description.replace(/, $/g, '');
		}
		if (set.description) description += `\n${set.description}`;

		let footer = '';
		if (set.series.collectable) footer += 'Collectable ';
		if (set.series.packable) footer += 'Purchasable ';
		footer = footer.replace(/ $/g, '');		

		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		embed.setFooter(footer);
		message.channel.send(embed);
	}
}