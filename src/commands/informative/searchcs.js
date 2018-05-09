const Discord = require('discord.js');
const Commando = require('discord.js-commando');

header = str => `**${str}**`;
spltter = str => `**~~\`----------------\`~~\` (${str}) \`~~\`----------------\`~~**`;
example = str => `    Example: \`${str}\``;

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'filter-sheet',
				aliases: ['filters'],
				group: 'collector_informative',
				memberName: 'filter-cheatsheet',
				description: 'A cheatsheet for search filters'
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
		${example(`own\` or \`own:@${this.client.user.username}`)}

		${header('Author')} Search cards for the author.
		${example(`author\` or \`author:@${this.client.user.username}`)}

		${header('Guarded')} Search if the cards are guarded
		${example('guarded')}

		${header('Tradable')} Search if the cards are tradable/marketable
		${example('tradable')}

		${header('Title')} Search the card title.
		${example('title:Wumpus')}

		${header('Tag')} Search the card tags.
		${example('tag:Discord')}

		${header('Description')} Search the card description.
		${example('description:"A picture of Wumpus"')}

		${header('Rarity')} Search for the rarity.
		${example('rarity:common')}

		__Fallback filters are Title and Tag__
		
		${spltter('Card Grinding')}
		Same as Card Searching
		__Fallback filter is Rarity__

		${spltter('Set Searching')}
		${header('Purchasable')} Search for sets that can be purchased.
		${example('purchasable')}

		${header('Author')} Search sets, and cards for the author.
		${example(`author\` or \`author:@${this.client.user.username}`)}

		${header('Title')} Search the set title.
		${example('title:Wumpus')}

		${header('Tag')} Search the set and cards tags.
		${example('tag:Discord')}

		${header('Description')} Search the set description.
		${example('description:"A set dedicated to all the Wumpuses"')}

		__Fallback filters are Title and Tag__

		${spltter('Offer Searching')}
		${header('Initiator')} Search offers for the Initiator.
		${example(`initiator\` or \`initiator:@${this.client.user.username}`)}

		${header('Recipient')} Search offers for the Recipient.
		${example(`recipient\` or \`recipient:@${this.client.user.username}`)}

		${header('Card')} Search the offers and requests for the card id.
		${example('card:0001')}

		__Fallback filter is Card__
		`;
		information = information.replace(/^\t+/gm, '');
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Filters Sheet')
		embed.setDescription(information);
		message.author.send(embed);
	}
}