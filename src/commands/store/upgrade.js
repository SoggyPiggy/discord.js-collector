const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = class _Command extends Commando.Command
{
	constructor(Client, Collector)
	{
		super(Client,
			{
				name: 'upgrade',
				aliases: ['upgrade-info', 'u'],
				group: 'collector_store',
				memberName: 'upgrade',
				description: 'View information / Upgrade a User Upgrade.',
				args:
				[
					{
						key: 'upgradeID',
						label: 'Upgrade ID',
						prompt: 'What is the ID of the upgrade?',
						type: 'string'
					},
					{
						key: 'quickConfirm',
						label: 'Quick Confirm',
						prompt: 'Would you like to confirm your purchase',
						type: 'boolean',
						default: false
					}
				]
			});
		this.collector = Collector;
	}

	async run(message, args)
	{
		let upgradeID = this.collector.utils.formatID(args.upgradeID);
		let upgrade = this.collector.upgrades.get(upgradeID);
		if (!upgrade) return message.reply(`Unable to find Upgrade: \`${upgradeID}\``);
		let user = this.collector.users.get(message.author);
		let currentLevel = user.upgrades.get(upgrade.id);
		let nextLevel = upgrade.get(currentLevel + 1);
		let embed = new Discord.MessageEmbed();
		embed.setTitle('Upgrade Details');
		embed.setDescription(upgrade.details(currentLevel));
		message.channel.send(`${user}`, embed);
		let confirmation = args.quickConfirm;
		if (nextLevel)
		{
			if (!confirmation)
			{
				if (user.credits < nextLevel.cost) return;
				confirmation = await this.collector.utils.addConfirmation(message, args, `Would you like to upgrade to Level ${nextLevel.level} for **${this.collector.utils.formatCredits(nextLevel.cost)}**?`);
				if (!confirmation) return message.reply('Upgrade Canceled');
			}
			else
			{
				if (user.credits < nextLevel.cost) return message.reply(`Insufficient Credits. The next level costs ${this.collector.utils.formatCredits(nextLevel.cost)}`);
			}
			user.credits -= nextLevel.cost;
			user.upgrades.set(upgrade.id, nextLevel.level);
			user.save();
			message.reply(`${upgrade} has been upgraded to Level ${nextLevel.level} from ${currentLevel}`);
			this.collector.emit('upgradeUpgraded', {user, message, args}, upgrade, currentLevel, nextLevel.level);
		}
	}
}