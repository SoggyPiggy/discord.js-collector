const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'cards',
				group: 'collector_card',
				memberName: 'cards',
				description: 'cards'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}