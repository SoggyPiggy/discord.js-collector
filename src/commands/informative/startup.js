const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'start-up-guide',
				group: 'collector_informative',
				memberName: 'start-up-guide',
				description: 'start-up-guide'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}