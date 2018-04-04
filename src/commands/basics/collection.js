const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'collection',
				group: 'collector_basic',
				memberName: 'collection',
				description: 'collection'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}