const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'set-info',
				group: 'collector_sets',
				memberName: 'set-info',
				description: 'set-info'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}