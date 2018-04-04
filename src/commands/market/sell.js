const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'sell-card',
				group: 'collector_market',
				memberName: 'sell-card',
				description: 'sell-card'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}