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
				type: 'integer|user'
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
		credits = String(credits);
		let count = 0;
		let number = '';
		for (let i = credits.length - 1; i >= 0; i--)
		{
			if (count > 2)
			{
				number = ',' + number;
				count = 0;
			}
			number = credits[i] + number;
			count++;
		}
		return this.options.creditPrefix + number;
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
		let highest = 0;
		if (user)
		{
			for (let i = 0; i < cards.length; i++)
			{
				let card = cards[i];
				if (typeof card === 'string')
				{
					let temp = this.collector.registry.cards.get(card);
					if (typeof temp !== 'undefined')
					{
						cards[i] = temp;
						card = temp;
					}
				}
				let count = user.cards.get(card);
				if (count)
				{
					if (count > highest) highest = count;
				}
			}
			highest = String(highest).replace(/\d/g, '0');
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
}