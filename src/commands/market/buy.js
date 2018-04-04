const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'buy-card',
				group: 'collector_market',
				memberName: 'buy-card',
				description: 'buy-card'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}