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
				description: 'View information about a set',
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
		if (typeof set === 'undefined') return message.reply(`Unable to find Set: \`${setID}\``);
		if (set.visibility > 2) return message.reply(`Unable to find Set: \`${setID}\``);
		let user = this.collector.users.get(message.author);
		if (set.visibility > 1 && !set.owned(user)) return message.reply(`Unable to find Set: \`${setID}\``);
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Set Details');
		embed.setDescription(set.details({user}));
		message.channel.send(embed);
	}
}