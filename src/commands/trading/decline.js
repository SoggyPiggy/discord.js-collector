const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'decline',
				group: 'collector_trading',
				memberName: 'decline',
				description: 'decline'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}