const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'offers',
				group: 'collector_trading',
				memberName: 'offers',
				description: 'offers'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{ }
}