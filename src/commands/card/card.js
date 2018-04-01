const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'card',
				group: 'collector_card',
				memberName: 'card',
				description: 'card'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}