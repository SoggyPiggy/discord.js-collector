const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'listings',
				group: 'collector_market',
				memberName: 'listings',
				description: 'listings'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}