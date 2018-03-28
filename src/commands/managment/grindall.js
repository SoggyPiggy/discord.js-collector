const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'grind-all',
				group: 'collector_managment',
				memberName: 'grind-all',
				description: 'grind-all'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}