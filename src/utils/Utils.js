const Random = require('./random');

module.exports = class Utils
{
	constructor(collector)
	{
		this.collector = collector;
		this.options = collector.options;

		this.args = 
		{
			cardID:
			{
				key: 'cardID',
				label: 'Card ID',
				prompt: 'What is the ID of the Card?',
				type: 'string',
				parse: this.formatCardID
			},
			setID:
			{
				key: 'setID',
				label: 'Set ID',
				prompt: 'What is the ID of the Set?',
				type: 'string',
				parse: this.formatSetID
			},
			page:
			{
				key: 'page',
				label: 'Page Number',
				prompt: 'What page are you looking for',
				type: 'number',
				default: 1
			}
		}
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