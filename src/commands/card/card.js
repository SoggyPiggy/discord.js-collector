const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'card-info',
				group: 'collector_card-info',
				memberName: 'card-info',
				description: 'card-info'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}