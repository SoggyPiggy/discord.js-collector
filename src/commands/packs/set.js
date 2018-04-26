const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'setpack',
				group: 'collector_packs',
				memberName: 'setpack',
				description: `Buy # cards from a certain set for ${Collector.utils.formatCredits(Collector.options.pricing.setpack)}`,
				args: [Collector.utils.args.setID, Collector.utils.args.creditConfirmation(Collector.utils.formatCredits(Collector.options.pricing.setpack))]				
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		if (!args.confirmation) return;
		let setID = this.collector.utils.formatSetID(args.setID);
		let set = this.collector.registry.sets.get(setID);
		if (typeof set === 'undefined')
		{
			message.reply(`Unable to find Set: \`${setID}\``);
			return
		}
		if (set.visibility > 1 && !set.purchasable)
		{
			message.reply(`Unable to find Set: \`${setID}\``);
			return
		}
		if (!set.purchasable)
		{
			message.reply(`Unable to purchase from Set \`${setID}\``);
			return;
		}
		let user = this.collector.users.get(message.author);
		let cost = this.collector.options.pricing.setpack;
		if (user.credits < cost) return message.reply(`You do not have ${this.collector.utils.formatCredits(cost)} to spend.`);
		let reply = message.channel.send(`<@${user.id}> Collecting Cards...`);
		let response = `<@${user.id}> Setpack`
		let cards = [];
		let renderData = [];
		while(cards.length < 3)
		{
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
		user.credits -= cost;
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
			this.collector.emit('error', error);
			reply = await reply;
			reply.edit(response);
		}
		this.collector.emit('setpack', user, cards, renderData);
	}
}