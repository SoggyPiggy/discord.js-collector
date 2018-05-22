const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'grind-x',
				aliases: ['g-x'],
				group: 'collector_managment',
				memberName: 'grind-x',
				description: 'Grind the matching cards X times',
				details: 'Use filters and searching to select the cards you want to grind. If no search filters are given the filter \'-guarded\' is used.\nTo quick confirm you can just put a \'y\' at the end',
				args:
				[
					{
						key: 'count',
						label: 'Grind Count',
						prompt: 'How many of the matching cards would you like to grind?',
						type: 'integer'
					},
					{
						key: 'filters',
						label: 'Filter(s)',
						prompt: 'What filters would you like to apply?',
						type: 'string',
						default: '-guarded'
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		if (args.count <= 0) return;
		args.filters = args.filters.split(' ');
		let confirmation = null;
		if (args.filters.length > 0) confirmation = this.collector.utils.quickConfirm(args.filters);
		args.filters = args.filters.join(' ');
		let user = this.collector.users.get(message.author, false);
		if (!user) return message.reply('You do not have any cards.');
		let handler = new this.collector.utils.CardHandler(this.collector, {user: user, items: user.cards.keys()});
		handler.processItems();
		handler.addFilter('own');
		handler.applyFilters(args.filters, [{keys: ['rarity'], threshold: 0}]);
		handler.sort();
		let cards = handler.cards;
		let grindInfo = new Discord.MessageEmbed();
		grindInfo.setTitle('Grind Details')
		grindInfo.setDescription(handler.grindList(args.count));
		message.channel.send(`<@${user.id}>`, grindInfo);
		if (!confirmation) confirmation = await this.collector.utils.addConfirmation(message, args, 'Confirm Grind');
		if (!confirmation) return message.reply('Grind Canceled');
		let groundCount = 0;
		let groundUnique = 0;
		let groundCards = [];
		for (let [key, card] of cards)
		{
			let ground = user.cards.remove(card, args.count);
			if (!ground) continue;
			user.giveXP((card.xp * this.collector.options.grindPercent) * ground);
			groundUnique++;
			groundCount += ground;
			groundCards.push({id: card.id, card: card, count: ground});
		}
		user.save();
		message.reply('Grind Completed')
		this.collector.emit('grind', {user, message, args}, groundCards, groundCount, groundUnique);
	}
}