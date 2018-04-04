const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'accept',
				group: 'collector_trading',
				memberName: 'accept',
				description: 'accept'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}