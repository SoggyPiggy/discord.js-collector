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
				args:
				[
					{
						key: 'setID',
						label: 'Set ID',
						prompt: 'What is the ID of the Set?',
						type: 'string',
					},
					{
						key: 'page',
						label: 'Page Number',
						prompt: 'Which page would you like to view?',
						type: 'integer',
						default: 1
					}
				]
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
			let owned = set.owned(user);
			if (!owned)
			{
				message.reply(`Unable to find Set: \`${setID}\``);
				return;
			}
			cards = [];
			for (let card of set.cards.values())
			{
				if (card.owned(user)) cards.push(card);
			}
		}

		let description = `**Set:** ${set.title} \`${set.id}\``;
		cards = this.collector.utils.pagify(args.page, cards);
		description += `\n**Cards:**\n` + this.collector.utils.cardList(cards.results, {user: user, set: false});
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
		if (set.obtainable && set.series.collectable) footer += 'Collectable ';
		if (set.purchasable) footer += 'Purchasable ';
		footer = footer.replace(/ $/g, '');		

		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		embed.setFooter(footer);
		message.channel.send(embed);
	}
}