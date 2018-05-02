const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'starterpack',
				group: 'collector_packs',
				memberName: 'starterpack',
				description: `Get ${Collector.options.packs.starter} cards for free once`
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user = this.collector.users.get(message.author);
		if (user.starterpack)
		{
			message.reply('You have already claimed your StarterPack.');
			return;
		}
		let reply = message.channel.send(`<@${user.id}> Collecting Cards...`);
		let response = `<@${user.id}> Starterpack`
		let cards = [];
		let renderData = [];
		while(cards.length < this.collector.options.packs.starter)
		{
			let series = this.collector.registry.packable.random();
			let set = series.sets.random();
			let card = set.cards.random();
			let isNew = !user.cards.has(card);
			user.cards.add(card);
			user.giveXP(card.xp);
			if (card.author && this.collector.options.authorGratuity > 0)
			{
				let author = this.collector.users.get(card.author, false);
				if (author)
				{
					author.giveXP(card.xp * this.collector.options.authorGratuity);
					author.save();
				}
			}
			cards.push(card);
			renderData.push({card: card, new: isNew});
		}
		renderData.sort((a, b) =>
		{
			if (a.new && !b.new) return -1;
			if (b.new && !a.new) return 1;
			return b.card.value - a.card.value;
		})
		for(let data of renderData)
		{
			response += `\n\`${data.card.id}\` **${data.card.title}** *${data.card.rarity}*`;
		}
		user.starterpack = true;
		user.save();
		try
		{
			let style = this.collector.cardstyles.get();
			let buffer = await style.render(renderData);
			if (!buffer) throw new Error('Unable to render');

			let attachment = new Discord.MessageAttachment();
			attachment.setFile(buffer);
			attachment.setName('Pack.png');
			reply = await reply;
			await message.channel.send(response, attachment);
			reply.delete();
		}
		catch(error)
		{
			console.error(error);
			reply = await reply;
			reply.edit(response);
		}
		this.collector.emit('starterpack', user, cards, renderData);
	}
}