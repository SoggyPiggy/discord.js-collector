const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		let time = '';
		if (Collector.options.collectMaxCooldown != Collector.options.collectMinCooldown) time = `${Collector.utils.formatTime(Collector.options.collectMinCooldown)} to ${Collector.utils.formatTime(Collector.options.collectMaxCooldown)}` 
		else time = `${Collector.utils.formatTime(Collector.options.collectMinCooldown)}`
		super(Client,
			{
				name: 'collect',
				group: 'collector_basic',
				memberName: 'collect',
				description: `Collect a new card every ${time}.`
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user = this.collector.users.get(message.author);
		let cooldown = user.cooldowns.get('collect');
		if (!cooldown.ready)
		{
			message.reply('You can not collect yet.');
			this.collector.emit('collectFailed', user, message);
			return;
		}
		let reply = message.channel.send(`<@${user.id}> Collecting Card...`);
		cooldown.trigger();
		let series = this.collector.registry.collectable.random();
		let set = series.sets.random();
		let card = set.cards.random();
		let isNew = !user.cards.has(card);
		let renderData = {card: card, new: isNew};
		user.cards.add(card);
		user.giveXP(card.xp);
		user.save();
		if (card.author && this.collector.options.authorGratuity > 0)
		{
			let author = this.collector.users.get(card.author, false);
			if (author)
			{
				author.giveXP(card.xp * this.collector.options.authorGratuity);
				author.save();
			}
		}
		try
		{
			let style = this.collector.cardstyles.get(user.settings.get('cardstyle'));
			let buffer = await style.render(renderData);
			if (!buffer) throw new Error('Unable to render');

			let attachment = new Discord.MessageAttachment();
			attachment.setFile(buffer);
			attachment.setName('Card.png');
			reply = await reply
			await message.channel.send(`<@${user.id}> Collected \`${card.id}\` **${card.title}** *${card.rarity}*`, attachment);
			reply.delete();
		}
		catch(error)
		{
			console.error(error);
			reply = await reply;
			reply.edit(`<@${user.id}> Collected \`${card.id}\` **${card.title}** *${card.rarity}*`);
		}
		this.collector.emit('collect', card, user, message);
	}
}