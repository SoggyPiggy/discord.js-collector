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
				description: 'View your collected cards',
				args:
				[
					{
						key: 'page',
						label: 'Page Number / Filter',
						prompt: 'Which page would you like to view? or whos collection would you like to see?',
						type: 'integer|user',
						default: 1
					},
					{
						key: 'member',
						label: 'User',
						prompt: 'Whos collection would you like to see?',
						type: 'user',
						default: false
					}
				],
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
			if (!user) return message.reply(`<@${args.page.id}> does not own any cards.`);
			args.page = 1;
		}
		else if (args.member instanceof Discord.User)
		{
			user = this.collector.users.get(args.member, false);
			if (!user) return message.reply(`<@${args.member.id}> does not own any cards.`);
		}
		else
		{
			user = author;
			if (!user) return message.reply('You have yet to collect and do not have Cards.\nUse the help command to learn more.');
		}
		if (user.cards.size <= 0) return message.reply('You have yet to collect and do not have Cards.\nUse the help command to learn more.');
		let handler = new this.collector.utils.CardHandler(this.collector, {user, items: user.cards.keys()});
		handler.processItems();
		handler.sort();
		let description = `${user}'s Collection.\n${handler.list(args.page, {collected: false})}`;
		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		message.channel.send(embed);
	}
}