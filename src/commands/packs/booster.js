const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'boosterpack',
				group: 'collector_packs',
				memberName: 'boosterpack',
				description: 'boosterpack'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}