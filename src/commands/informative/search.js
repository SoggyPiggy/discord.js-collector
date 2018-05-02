const Discord = require('discord.js');
const Commando = require('discord.js-commando');

let gap = '    ';

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
	{
		let information =
		`
		__**Search Structure**__

		\`Command filter filter:query filter query\`

		Or if they were to be filled out it would look more like:
		\`cards guarded rarity:exclusive own seasonal\`

		\`cards\` is the command.

		\`guarded\`, \`rarity\`, and \`own\` are filters. Some filters like 'rarity' need a query to go along with it, some like 'guarded' do not, and others like 'own' can have a query with it or not. For example 'own' alone defaults the query to the user calling the command.

		\`exclusive\` and \`seasonal\` are the queries. 'exclusive' is attached to the 'rarity' filter so it will card card's raritys for exclusive and thats it. 'seasonal' has no filter so it utilises the fallback filters.

		__For more information on different filters use the __\`filters\`__ command__


		__**Filter Priorities**__

		Filters prioritize from left to right.

		If a filter yields 0 results from its search it will be ignored.
		
		For example:
		\`cards rarity:common rarity:rare\`
		
		Since \`rarity:common\` comes first it will filter to only common cards which means that there will be no rare cards so the \`rarity:rare\` filter will be ignored.
		
		
		__**Filter/Query Prefixs**__
		
		If you want the results of your filter/query to be included you don't have to do anything, but you can prefix the filter/query with a +.

		If you want to results of your filter/query to be excluded prefix your filter/query with a -.

		For example:
		\`cards rarity:exclusive -guarded\`

		The filter \`rarity:exclusive\` has no prefix so it defaults to being \`+rarity:exclusive\`

		The filter \`-guarded\` on the other hand has the - prefix. This means that any cards that are guarded will be excluded.


		__**Query Grouping**__

		You can group together queries by enclosing them with "s.
		
		For example:
		\`sets title:"Discord HypeSquad Set" "description:For the HypeSquad"\`
		
		It doesn't matter if you put the " before or after the filter. They'll both work.
		`
		information = information.replace(/^\t+/gm, '');
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Search Guide')
		embed.setDescription(information);
		message.author.send(embed);
	}
}