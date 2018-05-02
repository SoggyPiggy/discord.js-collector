const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'quick-start-guide',
				aliases: ['quick-start'],
				group: 'collector_informative',
				memberName: 'quick-start-guide',
				description: 'start-up-guide'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let time = '';
		if (this.collector.options.collectMaxCooldown != this.collector.options.collectMinCooldown) time = `${this.collector.utils.formatTime(this.collector.options.collectMinCooldown)} to ${this.collector.utils.formatTime(this.collector.options.collectMaxCooldown)}`
		else time = `${this.collector.utils.formatTime(this.collector.options.collectMinCooldown)}`

		let information = 
		`
		Use the \`collect\` command to get new cards. It has a cooldown of ${time}
		`
		if (this.collector.options.features.packs)
		{
			information +=
			`
			If you haven't yet you can use the \`starterpack\` command to collect ${this.collector.options.packs.starter} free cards for a one time use.

			Collecting cards will give you XP and level you up. Leveling will give you credits which you can buy more cards with \`boosterpack\` or \`setpack\` commands. Setpack is like Boosterpack but for a specific set.
			`
		}
		if (this.collector.options.features.managment)
		{
			information += 
			`
			If you happen to find yourself with too many cards and you want to turn them into XP. You can use the \`grind-x\`, \`grind-dupe\`, or \`grind-all\` commands.
			Grind X will grind the cards x amount of times.
			Grind Dupe will grind the duplicates.
			Grind All will grind all the cards.
			`
		}
		information = information.replace(/^\t+/gm, '');
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Quick Start Guide')
		embed.setDescription(information);
		message.author.send(embed);
	}
}