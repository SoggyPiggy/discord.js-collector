const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'balance',
				aliases: ['bal'],
				group: 'collector_credits',
				memberName: 'balance',
				description: 'Get your credit balance'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user = this.collector.users.get(message.author);
		let credits = this.collector.utils.formatCredits(user.credits);
		message.reply(`**${credits}**`);
	}
}