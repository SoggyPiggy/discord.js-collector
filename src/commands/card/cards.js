const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'cards',
				aliases: ['card-search', 'c-search'],
				group: 'collector_card',
				memberName: 'cards',
				description: 'View/Search through the list of cards',
				details: 'View the list of all the cards. With extra arguments you can search through all the cards and selet which page you would like to view.\nYou can use the help command to read more about searching.',
				args: [Collector.utils.args.pageSearch, Collector.utils.args.search]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let page = 1;
		let filter = '';
		if (typeof args.page === 'number') page = args.page;
		else if (typeof args.page === 'string') filter = args.page + ' ';
		if (args.filters) filter = filter + args.filters;
		let user = this.collector.users.get(message.author);
		let searcher = new this.collector.utils.Searcher(this.collector, user);
		let cards = searcher.searchCards(filter);
		// console.log(cards.results);
		for (let p in cards)
		{
			console.log(`cards.${p} => ${typeof cards[p]}`);
			console.log(`Instance of Map: ${cards[p] instanceof Map}`);
		}
		
		page = this.collector.utils.pagify(page, Array.from(cards.results.values()));
		let description = `Used: ${cards.used}\nIgnored: ${cards.ignored}\n`;
		
		for (let v of page.results)
		{
			description += `${v.id} `;
		}
		console.log(description);
		message.reply(description);
	}
}