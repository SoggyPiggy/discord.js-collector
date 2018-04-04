const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'cancel-listing',
				group: 'collector_market',
				memberName: 'cancel-listing',
				description: 'cancel-listing'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}