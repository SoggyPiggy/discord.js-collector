const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'balance',
				group: 'collector_credits',
				memberName: 'balance',
				description: 'balance'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}