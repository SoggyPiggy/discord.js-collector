const Commando = require('discord.js-commando');
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
		this.OfferHandler = require('./utils/handlers/OfferHandler');
		this.Searcher = require('./utils/Searcher');
		this.Cooldown = require('./utils/Cooldown');
		this.smartsort = require('./utils/SmartSort');
		this.IDMap = require('./utils/IDMap');
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

	async addConfirmation(message, args, prompt = 'Confirm')
	{
		let oldArgs = message.command.argsCollector.args;
		let newArgs = [];
		let completedValues = [];
		for (let value of oldArgs)
		{
			completedValues.push(String(args[value.key]));
			newArgs.push({key: value.key, prompt: value.prompt, type: value.type.id, default: true});
		}
		let arg = { key: 'addConfirmation', label: 'Confirmation', type: 'boolean' };
		arg.prompt = `${prompt}\n(Y)es or (N)o`;
		newArgs.push(arg);
		let argumentcollector = new Commando.ArgumentCollector(message.command.client, newArgs);
		let awaited = await argumentcollector.obtain(message, completedValues);
		if (awaited.cancelled) return false;
		else return awaited.values.addConfirmation;
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