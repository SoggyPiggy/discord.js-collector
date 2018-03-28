const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'listing-info',
				group: 'collector_market',
				memberName: 'listing-info',
				description: 'listing-info'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}