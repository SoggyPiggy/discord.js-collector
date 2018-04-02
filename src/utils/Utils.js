const Random = require('./random');

module.exports = class Utils
{
	constructor(collector)
	{
		this.collector = collector;
		this.options = collector.options;
	}
	
	formatSeriesID(id)
	{
		return id.replace(/\W/g, '').toLowerCase();
	}

	formatSetID(id)
	{
		id = id.replace(/\W/g, '').toUpperCase();
		while (id.length < this.options.setIDLength)
		{
			id = this.options.setIDFiller + id;
		}
		return this.options.setIDPrefix + id;
	}

	formatCardID(id)
	{
		id = id.replace(/\W/g, '').toUpperCase();
		while(id.length < this.options.cardIDLength)
		{
			id = this.options.cardIDFiller + id;
		}
		return this.options.cardIDPrefix + id;
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