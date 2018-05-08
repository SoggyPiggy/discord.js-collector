const Handler = require('./Handler');
const Fuse = require('fuse.js');

module.exports = class CardHandler extends Handler
{
	constructor(Collector, options)
	{
		if (typeof options.items === 'undefined') options.items = new Map(Collector.registry.cards)
		super(Collector, options);
		this.type = 'card';
	}

	get cards()
	{
		return this.items;
	}

	filter(filter, fallback)
	{
		if (!fallback.length) fallback = [{keys: ['tags'], threshold: 0 }, { keys: ['title'], threshold: .3}]
		let results = [];
		if (this.items.has(this.utils.formatCardID(filter))) return [this.utils.formatCardID(filter)];
		let filterParts = filter.split(':');
		switch(filterParts[0])
		{
			case 'own':
			{
				let user = filter.replace(/^own:?/gi, '');
				user = this.getUser(user);
				if (!user) return [];
				for (let [key, card] of this.items)
				{
					if (user.cards.has(key)) results.push(key);
				}
				break;
			}
			case 'author':
			{
				let author = filter.replace(/^author:?/gi, '');
				author = this.getUser(author);
				if (!author) return [];
				for (let [key, card] of this.items)
				{
					if (card.author == author.id) results.push(key);
				}
				break;
			}
			case 'guarded':
			{
				for (let [key, card] of this.items)
				{
					if (card.guarded) results.push(key);
				}
				break;
			}
			case 'tradable':
			{
				for (let [key, card] of this.items)
				{
					if (!card.untradable) results.push(key);
				}
				break;
			}
			default:
			{
				let fuseoptions = {id: 'id', location: 0, distance: 100, maxPatternLength: 32, minMatchCharLength: 1};
				let fuses = [];
				let fuseCards = [];
				for (let [key, card] of this.items)
				{
					fuseCards.push(card.compress());
				}
				switch(filterParts[0])
				{
					case 'rarity':
					{
						filter = filter.replace(/^rarity:?/gi, '');
						fuseoptions.keys = ['rarity'];
						fuseoptions.threshold = 0;
						fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
					}
					case 'tag':
					{
						filter = filter.replace(/^tag:?/gi, '');
						fuseoptions.keys = ['tags'];
						fuseoptions.threshold = 0;
						fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
					}
					case 'title':
					{
						filter = filter.replace(/^title:?/gi, '');
						fuseoptions.keys = ['title'];
						fuseoptions.threshold = .3;
						fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
					}
					case 'description':
					{
						filter = filter.replace(/^description:?/gi, '');
						fuseoptions.keys = ['description'];
						fuseoptions.threshold = .5;
						fuses.push(new Fuse(fuseCards, fuseoptions));
						break;
					}
					default:
					{
						for (let fb of fallback)
						{
							fuseoptions.keys = fb.keys;
							fuseoptions.threshold = fb.threshold;
							fuses.push(new Fuse(fuseCards, fuseoptions));
						}
						break;
					}
				}
				if (!filter) return [];
				for (let fuse of fuses)
				{
					results = results.concat(fuse.search(filter))
				}
				results = Array.from(new Set(results));
			}
		}
		return results;
	}
	
	listItems(items, options)
	{
		if (typeof options.collected === 'undefined') options.collected = true;
		if (typeof options.count === 'undefined') options.count = true;
		if (typeof options.id === 'undefined') options.id = true;
		if (typeof options.set === 'undefined') options.set = true;	
		if (typeof options.title === 'undefined') options.title = true;
		if (typeof options.rarity === 'undefined') options.rarity = true;
		let listItems = [];
		let highest = 0;
		if (options.count && this.user)
		{
			for (let [key, item] of items)
			{
				let count = this.user.cards.get(item);
				if (count)
				{
					if (count > highest) highest = count;
				}
			}
			highest = String(highest).replace(/./g, '0');
			while (highest.length < 2)
			{
				highest += '0';
			}
		}
		for (let [key, item] of items)
		{
			let line = '';
			if (typeof item === 'string')
			{
				if (this.user && (options.collected || options.count))
				{
					line += '`';
					if (options.collected) line += '⛔';
					if (options.count)
					{
						let owned = String(this.user.cards.get(item));
						while (owned.length < highest.length) {owned = '0' + owned};
						line += owned;
					}
					line += '`';
				}
				line += ` \`${card}\` __Card Unavailable__`;				
			}
			else
			{
				let owned = false;
				if (this.user && (options.collected || options.count))
				{
					owned = this.user.cards.get(item);
					line += '`';
					if (options.collected)
					{
						if (owned) line += `✔️`;
						else line += `❌`;
					}
					if (options.count)
					{
						if (owned)
						{
							owned = String(owned);
							while (owned.length < highest.length) {owned = '0' + owned};
							line += owned;
						}
						else line += highest;
					}
					line += '`';					
				}
				if (options.id) line += ` \`${item.id}\``;
				if (options.set) line += ` \`${item.set.id}\``;
				if (options.title)
				{
					if ((this.user && owned) || !this.user || item.visibility <= 0) line += ` **${item.title}**`;
					else line += ` **~~?????~~**`;
				}
				else line += ` **~~?????~~**`;
				if (options.rarity) line += ` *${item.rarity}*`;
			}
			line = line.replace(/^ /g, '');
			listItems.push(line);
		}
		return listItems;
	}
	
	grindList(count)
	{
		let total = 0;
		let unique = 0;
		let rarities = {};
		for (let [key, item] of this.items)
		{
			let grind = count;
			let owned = this.user.cards.get(item);
			if (count === 'all') grind = owned;
			else if (count === 'dupe') grind = owned - 1;
			else if (count > owned) grind = owned;
			if (!grind) continue;
			if (typeof rarities[item.rarity] === 'undefined') rarities[item.rarity] = 0;
			total += grind;
			unique++;
			rarities[item.rarity] += grind;
		}
		let list = '';
		if ((this.filters.used.length + this.filters.ignored.length) > 0)
		{
			list += `**Filters:** `;
			for (let filter of this.filters.used) {list += `${filter}, `;}
			for (let filter of this.filters.ignored) {list += `~~${filter}~~, `;}
			list = list.replace(/, $/g, '\n');
		}
		list += `**Total Cards:** ${total}\n`;
		list += `**Unique Cards:** ${unique}\n`;
		list += `~~\`--------\`~~\` (Rarities) \`~~\`--------\`~~\n`
		let listItems = [];
		for (let p in rarities)
		{
			listItems.push(`**${p}:** ${rarities[p]}`);
		}
		list += listItems.join('\n');
		return list;
	}
	
	processItems()
	{
		super.processItems(require('./../../structures/Card'), this.collector.registry.cards);
	}
}