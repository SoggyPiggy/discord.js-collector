const Random = require('./random');
const Searcher = require('./Searcher');

module.exports = class Utils
{
	constructor(collector)
	{
		this.collector = collector;
		this.options = collector.options;
		this.Searcher = Searcher;

		this.args = 
		{
			cardID:
			{
				key: 'cardID',
				label: 'Card ID',
				prompt: 'What is the ID of the Card?',
				type: 'string',
				// parse: this.formatCardID
			},
			setID:
			{
				key: 'setID',
				label: 'Set ID',
				prompt: 'What is the ID of the Set?',
				type: 'string',
				// parse: this.formatSetID
			},
			page:
			{
				key: 'page',
				label: 'Page Number',
				prompt: 'Which page would you like to view?',
				type: 'integer',
				default: 1
			},
			search:
			{
				key: 'filters',
				label: 'Filter(s)',
				prompt: 'What filters would you like to apply?',
				type: 'string',
				default: false
			},
			user:
			{
				key: 'member',
				label: 'User',
				prompt: 'Who?',
				type: 'user',
				default: false
			},
			pageSearch:
			{
				key: 'page',
				label: 'Page Number / Filter',
				prompt: 'Which page would you like to view? or what filters would you like to apply?',
				type: 'integer|string',
				default: 1
			},
			pageUser:
			{
				key: 'page',
				label: 'Page Number / User',
				prompt: 'Which page would you like to view? or who?',
				type: 'integer|user', 
				default: 1
			}
		}
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
		return id.replace(/\W/g, '').toLowerCase();
	}

	formatSetID(id)
	{
		id = id.replace(/\W/g, '').toUpperCase();
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
		id = id.replace(/\W/g, '').toUpperCase();
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
		return Number(credits).toLocaleString('en', {maximumFractionDigits: 20});
	}

	cardList(cards, user = false, options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.collected === 'undefined') options.collected = true;
		if (typeof options.count === 'undefined') options.count = true;
		if (typeof options.id === 'undefined') options.id = true;
		if (typeof options.title === 'undefined') options.title = true;
		if (typeof options.rarity === 'undefined') options.rarity = true;
		if (typeof options.spliter === 'undefined') options.spliter = '\n';
		cards = this.convertCards(cards);
		let highest = 0;
		if (user)
		{
			for (let card of cards)
			{
				let count = user.cards.get(card);
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
				if (user && (options.collected || options.count)) line += '`';
				if (options.collected && user) line += `⛔`
				if (options.count && user)
				{
					let owned = false;
					if (user) owned = user.cards.get(card);
					owned = String(owned);
					while (owned.length < highest.length) { owned = '0' + owned; }
					line += owned;
				}
				if (user && (options.collected || options.count)) line += '`';
				line += ` \`${card}\` __Card Unavailable__`;
			}
			else
			{
				let owned = false;
				if (user) owned = user.cards.get(card);
				if (user && (options.collected || options.count)) line += '`';
				if (options.collected && user)
				{
					if (owned) line += `✔️`;
					else line += `❌`;
				} 
				if (options.count && user)
				{
					if (owned)
					{
						owned = String(owned);
						while(owned.length < highest.length) {owned = '0' + owned;}
						line += owned;
					}
					else line += highest;
				}
				if (user && (options.collected || options.count)) line += '`';
				if (options.id) line += ` \`${card.id}\``;
				if (options.title && ((user && owned) || !user)) line += ` **${card.title}**`;
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

	static shuffle(array)
	{
		var m = array.length, t, i;
		while(m)
		{
			i = Random.integer(0, m--);
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