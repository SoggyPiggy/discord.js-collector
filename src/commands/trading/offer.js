const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'offer-info',
				group: 'collector_trading',
				memberName: 'offer-info',
				description: 'offer-info'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}