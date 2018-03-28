const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'grind-dupe',
				group: 'collector_managment',
				memberName: 'grind-dupe',
				description: 'grind-dupe'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}