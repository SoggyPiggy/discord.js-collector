const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'transfer',
				group: 'collector_credits',
				memberName: 'transfer',
				description: 'Give someone credits',
				args: [Collector.utils.args.credits, Collector.utils.args.userRequired]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user = this.collector.users.get(message.author);
		args.credits = Math.abs(args.credits);
		if (user.credits < args.credits)
		{
			message.reply('You do not have enough credits to complete the transfer.');
			this.collector.emit('transferFailedCredits', user, message, args);
			return;
		}
		let target = this.collector.users.get(args.member, false);
		if (!target)
		{
			message.reply('The user you are trying to transfer to has not interacted with the bot yet.');
			this.collector.emit('transferFailedTarget', user, message, args);
			return;
		}
		user.credits -= args.credits;
		user.save();
		target.credits += args.credits;
		target.save();
		message.channel.send(`<@${user.id}> Transfered **${this.collector.utils.formatCredits(args.credits)}** to <@${target.id}>`);
		this.collector.emit('transfer', user, target, args.credits);
	}
}