const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'grind-x',
				group: 'collector_managment',
				memberName: 'grind-x',
				description: 'grind-x'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}