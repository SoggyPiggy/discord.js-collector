const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'sets',
				group: 'collector_sets',
				memberName: 'sets',
				description: 'sets'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}