const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'sets',
				aliases: ['set-search', 's-search'],
				group: 'collector_sets',
				memberName: 'sets',
				description: 'View/Search through the list of cards.',
				details: 'View the list of all the sets. With extra arguments you can search through all the sets and selet which page you would like to view.\nYou can use the help command to read more about searching.',
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
		if (args.filters) filter += args.filters;
		let user = this.collector.users.get(message.author);
		let searcher = new this.collector.utils.Searcher(this.collector);
		let search = searcher.searchSets(filter, {user: user});
		let sets = Array.from(search.results.values());

		page = this.collector.utils.pagify(page, sets);
		let description = ``;
		if ((search.used.length + search.ignored.length) > 0)
		{
			description += `**Filters:** `;
			for (let filter of search.used) { description += `${filter}, `; }
			for (let filter of search.ignored) { description += `~~${filter}~~, `; }
			description = description.replace(/, $/g, '');
		}
		description += `\n~~\`----------------\`~~\` (Page ${page.page} of ${page.max}) \`~~\`----------------\`~~\n`;
		description += this.collector.utils.setList(page.results, user);

		let embed = new Discord.MessageEmbed();
		embed.setDescription(description);
		message.channel.send(`<@${user.id}>`, embed);
	}
}