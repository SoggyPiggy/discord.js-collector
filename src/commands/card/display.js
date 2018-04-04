const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'display',
				group: 'collector_card',
				memberName: 'display',
				description: 'display'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}