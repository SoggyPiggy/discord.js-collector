const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'card-market-history',
				group: 'collector_market',
				memberName: 'card-market-history',
				description: 'card-market-history'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}