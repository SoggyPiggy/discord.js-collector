const Discord = require('discord.js');
const Commando = require('discord.js-commando');

header = str => `**${str}**`;
spltter = str => `~~\`----------------\`~~\` (${str}) \`~~\`----------------\`~~`;

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'search-cheatsheet',
				aliases: ['cheatsheet'],
				group: 'collector_informative',
				memberName: 'search-cheatsheet',
				description: 'A cheatsheet for search paramaters'
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let information = 
		`
		If a specific filter is not given the fallback filters will be used.
		${spltter('Card Searching')}
		${header('Own')} Searches for cards you, or someone owns.
		${header('Author')} Search cards for the author.
		${header('Guarded')} Search if the cards are guarded
		${header('Tradable')} Search if the cards are tradable/marketable
		${header('Title')} Search the card title.
		${header('Tag')} Search the card tags.
		${header('Description')} Search the card description.
		${header('Rarity')} Search for the rarity.
		*Fallback filters are Title and Tag*
		
		${spltter('Card Grinding')}
		Same as Card Searching
		*Fallback filter is Rarity*

		${spltter('Set Searching')}
		${header('Purchasable')} Search for sets that can be purchased.
		${header('Author')} Search sets, and cards for the author.
		${header('Title')} Search the set title.
		${header('Tag')} Search the set and cards tags.
		${header('Description')} Search the set description.
		*Fallback filters are Title and Tag*
		`;
		information = information.replace(/^\t+/gm, '');
		let embed = new Discord.MessageEmbed();
		embed.setDescription(information);
		message.author.send(embed);
	}
}