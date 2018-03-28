const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'news',
				group: 'collector_informative',
				memberName: 'news',
				description: 'news'
			});
		this.Collector = Collector;
	}

	async run(message, args)
	{ }
}