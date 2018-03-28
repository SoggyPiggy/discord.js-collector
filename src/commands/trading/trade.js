const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'trade',
				group: 'collector_trading',
				memberName: 'trade',
				description: 'trade'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}