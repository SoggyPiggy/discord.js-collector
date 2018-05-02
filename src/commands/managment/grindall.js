const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'grind-all',
				aliases: ['grind-a', 'g-a'],
				group: 'collector_managment',
				memberName: 'grind-all',
				description: 'Grind the matching cards',
				details: 'Use filters and searching to select the cards you want to grind. If no search filters are given the filter \'-guarded\' is used.\nTo quick confirm you can just put a \'y\' at the end',
				args: [Collector.utils.args.search]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		if (args.filters === false) args.filters = '';
		args.filters = args.filters.split(' ');
		let confirmation = null;
		if (args.filters.length > 0) confirmation = this.collector.utils.quickConfirm(args.filters);
		let quickConfirm = confirmation;
		args.filters = args.filters.join(' ');
		if (args.filters === '') args.filters = '-guarded';
		let user = this.collector.users.get(message.author, false);
		if (!user) return message.reply('You do not have any cards.');
		let handler = new this.collector.utils.CardHandler(this.collector, {user: user, items: user.cards.keys()});
		handler.processItems();
		handler.addFilter('own');
		handler.sort();
		handler.applyFilters(args.filters, [{keys: ['rarity'], threshold: 0}]);
		let cards = handler.cards;
		let grindInfo = new Discord.MessageEmbed();
		grindInfo.setTitle('Grind Details')
		grindInfo.setDescription(handler.grindList('all'));
		message.channel.send(`<@${user.id}>`, grindInfo);
		if (!confirmation)
		{
			let arg = {key: 'confirmation', labal: 'Confirmation', type: 'boolean'};
			arg.prompt = `Confirm grind\n(Y)es or (N)o`;
			let argumentcollector = new Commando.ArgumentCollector(this.client, [this.collector.utils.args.search, arg]);
			let awaited = await argumentcollector.obtain(message, [args.filters]);
			if (awaited.cancelled) confirmation = false;
			else confirmation = awaited.values.confirmation;
		}
		if (!confirmation) return message.reply('Grind Canceled');
		let groundCount = 0;
		let groundUnique = 0;
		let groundCards = [];
		for (let [key, card] of cards)
		{
			let count = user.cards.get(card);
			let ground = user.cards.remove(card, count);
			if (!ground) continue;
			user.giveXP((card.xp * this.collector.options.grindPercent) * ground);
			groundUnique++;
			groundCount += ground;
			groundCards.push({id: card.id, card: card, count: ground});
		}
		user.save();
		message.reply('Grind Completed')
		this.collector.emit('grind', groundCards, groundCount, groundUnique);
	}
}