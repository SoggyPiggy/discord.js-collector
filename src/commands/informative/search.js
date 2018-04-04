const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'search-guide',
				group: 'collector_informative',
				memberName: 'search-guide',
				description: 'search-guide'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}