const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'starterpack',
				group: 'collector_packs',
				memberName: 'starterpack',
				description: 'starterpack'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}