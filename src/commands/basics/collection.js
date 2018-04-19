const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'collection',
				group: 'collector_basic',
				memberName: 'collection',
				description: 'View your collected cards.',
				args:[Collector.utils.args.pageUser, Collector.utils.args.user]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user;
		let author = this.collector.users.get(message.author, false);
		if (args.page instanceof Discord.User)
		{
			user = this.collector.users.get(args.page, false);
			if (!user)
			{
				message.reply(`<@${args.page.id}> does not own any cards.`);
				return;
			}
			args.page = 1;
		}
		else if (args.member instanceof Discord.User)
		{
			user = this.collector.users.get(args.member, false);
			if (!user)
			{
				message.reply(`<@${args.member.id}> does not own any cards.`);
				return;
			}
		}
		else
		{
			user = author;
			if (!user)
			{
				message.reply('You have yet to collect and do not have Cards.\nUse the help command to learn more.');
				return;
			}
		}
		let cards = Array.from(user.cards.keys());
		if (cards.length <= 0)
		{
			if (user == author) message.reply('You do not own any cards.');
			else message.reply(`<@${user.id}> does not own any cards.`);
			return;
		}
		cards.sort();
		cards = this.collector.utils.pagify(args.page, cards);

		let description = `<@${user.id}>'s Collection.`;
		description += `\n~~\`----------------\`~~\` (Page ${cards.page} of ${cards.max}) \`~~\`----------------\`~~\n`;
		description += this.collector.utils.cardList(cards.results, {user: user, collected: false});

		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		message.channel.send(embed);
	}
}