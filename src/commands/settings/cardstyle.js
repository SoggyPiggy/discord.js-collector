const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
		{
			name: 'setting-cardstyle',
			aliases: ['cardstyle'],
			group: 'collector_settings',
			memberName: 'cardstyle',
			description: 'Select a style from the available card styles',
			details: 'Card styles are to change anywhere from small adjustments to complete theme changes for how the cards render.',
			args:
			[
				{
					key: 'quickselection',
					prompt: 'What card style would you like to use?',
					type: 'string',
					default: false
				}
			]
		})
		this.collector = Collector;
	}

	async run(message, args)
	{
		let user = this.collector.users.get(message.author)
		let selection = args.quickselection;
		if (selection)
		{
			selection = this.collector.utils.formatID(selection);
			if (this.collector.cardstyles.has(selection)) user.settings.set('cardstyle', selection);
			else (user.settings.set('cardstyle', null));
			user.save();
		}
		let selected = user.settings.get('cardstyle');
		if (selected === null) selected = this.collector.options.cardStyle;

		let lines = [];
		lines.push('**Card Styles**');
		lines.push(`**~~-----------------------------------------------~~**`);
		for (let [key, value] of this.collector.cardstyles)
		{
			let line = [`\`${key}\``, `${value.title}`]
			if (this.collector.options.cardStyle === key) line.push('__Default__');
			if (selected === key) line.push('__Selected__');
			lines.push(line.join(' '));
		}
		let embed = new Discord.MessageEmbed()
		embed.setTitle('Setting Options');
		embed.setDescription(lines.join('\n'));
		message.channel.send(`${user}`, embed);

		if (!selection)
		{
			let newArg = {key: 'selection', prompt: 'Which card style would you like to select.', type: 'string'}
			let argCollector = new Commando.ArgumentCollector(this.client, [{key: 'quickselection', prompt: 'Stuff', type: 'boolean', default: false}, newArg]);
			let awaited = await argCollector.obtain(message, [String(args.quickselection)]);
			if (awaited.cancelled) return message.reply('Settings have not been changed.');
			else selection = awaited.values.selection;

			selection = this.collector.utils.formatID(selection);
			if (this.collector.cardstyles.has(selection)) user.settings.set('cardstyle', selection);
			else (user.settings.set('cardstyle', null));
			selection = user.settings.get('cardstyle');
			if (selection === null) message.reply(`Card Style set: __Default__`);
			else message.reply(`Card Style set: \`${selection}\``);
			user.save();
		}
	}
}