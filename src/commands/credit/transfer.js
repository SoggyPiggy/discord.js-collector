const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'transfer',
				group: 'collector_credits',
				memberName: 'transfer',
				description: 'transfer'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}