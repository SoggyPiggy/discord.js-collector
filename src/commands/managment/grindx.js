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
				description: 'Grind the matching cards X times.',
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
						default: false
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
		handler.sort();
		handler.applyFilters(args.filters, [{keys: ['rarity'], threshold: 0}]);
		let cards = handler.cards;
		let grindInfo = new Discord.MessageEmbed();
		grindInfo.setTitle('Grind Details')
		grindInfo.setDescription(handler.grindList(args.count));
		message.channel.send(`<@${user.id}>`, grindInfo);
		if (!confirmation)
		{
			let arg = {key: 'confirmation', labal: 'Confirmation', type: 'boolean'};
			arg.prompt = `Confirm grind\n(Y)es or (N)o`;
			let argumentcollector = new Commando.ArgumentCollector(this.client, [this.collector.utils.args.grindCount, this.collector.utils.args.search, arg]);
			let awaited = await argumentcollector.obtain(message, [args.count, args.filters]);
			if (awaited.cancelled) confirmation = false;
			else confirmation = awaited.values.confirmation;
		}
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
		this.collector.emit('grind', groundCards, groundCount, groundUnique);
	}
}