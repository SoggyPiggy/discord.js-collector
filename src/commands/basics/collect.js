const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'collect',
				group: 'collector_basic',
				memberName: 'collect',
				description: 'collect'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}