const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'set',
				group: 'collector_sets',
				memberName: 'set',
				description: 'set'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}