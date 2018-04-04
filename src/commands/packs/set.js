const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'setpack',
				group: 'collector_packs',
				memberName: 'setpack',
				description: 'setpack'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}