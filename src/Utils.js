const random = require('./utils/random');

let parseID = function(id)
{
	if (typeof id === 'string') return id;
	if (typeof id.id === string) return id.id;
}

module.exports = class Utils
{
	constructor(collector)
	{
		this.collector = collector;
		this.options = collector.options;
		this.CardHandler = require('./utils/handlers/CardHandler');
		this.SetHandler = require('./utils/handlers/SetHandler');
		this.Searcher = require('./utils/Searcher');
		this.Cooldown = require('./utils/Cooldown');
		this.smartsort = require('./utils/SmartSort');
	}

	pagify(page, items)
	{
		page = page - 1;
		let pageItems = [];
		let itemsPerPage = 30;
		let pageMax = Math.ceil(items.length / itemsPerPage);
		if (page < 0) page = 0;
		if (page >= pageMax) page = pageMax - 1;
		for (let i = (itemsPerPage * page); (i < (itemsPerPage * (page + 1))) && i < items.length; i++)
		{
			pageItems.push(items[i]);
		}
		let data = {};
		data.page = page + 1;
		data.max = pageMax;
		data.results = pageItems;
		return data;
	}
	
	formatSeriesID(id)
	{
		return parseID(id).replace(/\W/g, '').toLowerCase();
	}

	formatSetID(id)
	{
		id = parseID(id).replace(/\W/g, '').toUpperCase();
		let options;
		if (typeof this.options !== 'undefined') options = this.options;
		else if (typeof this.command.collector.options !== 'undefined') options = this.command.collector.options;
		while (id.length < options.setIDLength)
		{
			id = options.setIDFiller + id;
		}
		return options.setIDPrefix + id;
	}

	formatCardID(id)
	{
		id = parseID(id).replace(/\W/g, '').toUpperCase();
		let options;
		if (typeof this.options !== 'undefined') options = this.options;
		else if (typeof this.command.collector.options !== 'undefined') options = this.command.collector.options;
		while (id.length < options.cardIDLength)
		{
			id = options.cardIDFiller + id;
		}
		return options.cardIDPrefix + id;
	}

	formatCredits(credits)
	{
		credits = Number(credits).toLocaleString('en', { maximumFractionDigits: 20 });
		return this.collector.options.creditPrefix + credits;
	}

	setList(sets, options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.id === 'undefined') options.id = true;
		if (typeof options.title === 'undefined') options.title = true;
		if (typeof options.splitter === 'undefined') options.spliter = '\n';
		sets = this.convertSets(sets);
		let list = '';
		for (let set of sets)
		{
			let line = '';
			if (typeof set === 'string')
			{
				line += set;
			}
			else
			{
				if (options.id) line += `\`${set.id}\``;
				if (options.title) line += ` **${set.title}**`;
			}
			line += options.spliter;
			line = line.replace(/^ /g, '');
			list += line;
		}
		let regexEnd = new RegExp( options.spliter + '$', 'g');
		return list.replace(regexEnd, '');
	}

	cardList(cards, options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.user === 'undefined') options.user = null;
		if (typeof options.collected === 'undefined') options.collected = true;
		if (typeof options.count === 'undefined') options.count = true;
		if (typeof options.id === 'undefined') options.id = true;
		if (typeof options.set === 'undefined') options.set = true;
		if (typeof options.title === 'undefined') options.title = true;
		if (typeof options.rarity === 'undefined') options.rarity = true;
		if (typeof options.spliter === 'undefined') options.spliter = '\n';
		cards = this.convertCards(cards);
		let highest = 0;
		if (options.user)
		{
			for (let card of cards)
			{
				let count = options.user.cards.get(card);
				if (count)
				{
					if (count > highest) highest = count;
				}
			}
			highest = String(highest).replace(/./g, '0');
			while (highest.length < 2)
			{
				highest = '0' + highest;
			}
		}
		let list = '';
		for (let card of cards)
		{
			let line = '';
			if (typeof card === 'string')
			{
				if (options.user && (options.collected || options.count)) line += '`';
				if (options.collected && options.user) line += `⛔`
				if (options.count && options.user)
				{
					let owned = false;
					if (options.user) owned = options.user.cards.get(card);
					owned = String(owned);
					while (owned.length < highest.length) { owned = '0' + owned; }
					line += owned;
				}
				if (options.user && (options.collected || options.count)) line += '`';
				line += ` \`${card}\` __Card Unavailable__`;
			}
			else
			{
				let owned = false;
				if (options.user) owned = options.user.cards.get(card);
				if (options.user && (options.collected || options.count)) line += '`';
				if (options.collected && options.user)
				{
					if (owned) line += `✔️`;
					else line += `❌`;
				} 
				if (options.count && options.user)
				{
					if (owned)
					{
						owned = String(owned);
						while(owned.length < highest.length) {owned = '0' + owned;}
						line += owned;
					}
					else line += highest;
				}
				if (options.user && (options.collected || options.count)) line += '`';
				if (options.id) line += ` \`${card.id}\``;
				if (options.set) line += ` \`${card.set.id}\``;
				if (options.title && ((options.user && owned) || !options.user || card.visibility <= 0)) line += ` **${card.title}**`;
				else line += ` **~~?????~~**`;
				if (options.rarity) line += ` *${card.rarity}*`;
			}
			line += options.spliter;
			line = line.replace(/^ /g, '');
			list += line;
		}
		let regexEnd = new RegExp(options.spliter + '$', 'g');
		return list.replace(regexEnd, '');
	}

	convertCardsMap(cards)
	{
		cards = this.convertCards(cards);
		let map = new Map();
		for (let card of cards)
		{
			if (typeof card === 'object') map.set(card.id, card);
			else if (typeof card === 'string') map.set(card, card);
		}
		return map;
	}

	convertCards(cards)
	{
		let data = [];
		for (let card of cards)
		{
			if (this.collector.cards.has(card)) data.push(this.collector.cards.get(card));
			else data.push(card);
		}
		return data;
	}

	convertSetsMap(sets)
	{
		sets = this.convertSets(sets);
		let map = new Map();
		for (let set of sets)
		{
			if (typeof set === 'object') map.set(set.id, set);
			else if (typeof set === 'string') map.set(set, set);
		}
		return map;
	}

	convertSets(sets)
	{
		let data = [];
		for (let set of sets)
		{
			if (this.collector.sets.has(set)) data.push(this.collector.sets.get(set));
			else data.push(set);
		}
		return data;
	}

	quickConfirm(items)
	{
		let end = items[items.length - 1];
		if (end.toLowerCase() !== 'y') return null;
		items.pop();
		return true;
	}

	static shuffle(array)
	{
		var m = array.length, t, i;
		while(m)
		{
			i = random.integer(0, m--);
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}
	shuffle(array)
	{
		return Utils.shuffle(array);
	}

	static formatTime(ms)
	{
		let date = new Date(ms);
		let hours = date.getUTCHours();
		let mins = date.getUTCMinutes();
		let secs = date.getUTCSeconds();

		let message = '';
		if (hours) message += hours + 'h';
		if (mins) message += mins + 'm';
		if (secs) message += secs + 's';
		if (message === '') return '0s';
		else return message;
	}
	formatTime(ms)
	{
		return Utils.formatTime(ms);
	}
}