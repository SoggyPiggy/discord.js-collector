const ChanceMap = require('./utils/ChanceMap');
const Series = require('./structures/Series');
const Set = require('./structures/Set');
const Card = require('./structures/Card');

module.exports = class CardRegistry
{
	constructor(collector)
	{
		this.collector = collector;
		this.locations = new Map();
		this.cards = new Map();
		this.sets = new Map();
		this.series = new Map();
		this.collectable = new ChanceMap();
		this.packable = new ChanceMap();
		this.mutatable = new ChanceMap();
	}

	registerDefaultSeries()
	{
		this.registerSeries({id: 'standard'});
		this.registerSeries({id: 'seasonal', chance: 40});
		this.registerSeries({id: 'valuable', chance: 5, packable: false})
	}

	registerSeries(data = {})
	{
		let series = new Series(data);
		if (this.series.has(series.id)) throw new Error(`Series with id ${series.id} already registered`);
		series.registery = this;
		this.series.set(series.id, series);
		this.collector.emit('debug', `Registered series ${series.id}.`);
		this.collector.emit('seriesRegister', series, this);
	}

	registerSet(set)
	{
		if (!set instanceof Set) throw new Error('registerSet only accepts instances of the Set class');
		if (this.sets.has(set.id)) throw new Error(`Set with id ${set.id} already registered`);
		if (!(set.series instanceof Series))
		{
			if (!this.series.has(set.series)) throw new Error(`Series with id ${set.series} has not been registered yet`);
			set.series = this.series.get(set.series);
		}
		if (set.omit) return;
		this.sets.set(set.id, set);
		this.collector.emit('debug', `Registered set ${set.id}.`);
		this.collector.emit('setRegister', set, this);
	}
	
	registerCard(card)
	{
		if (!card instanceof Card) throw new Error('registerCard only accepts instances of the Card class');
		if (this.cards.has(card.id)) throw new Error(`Card with id ${card.id} already registered`);
		if (!(card.set instanceof Set))
		{
			if (!this.sets.has(card.set)) throw new Error(`Set with id ${card.set} has not been registered yet`);
			card.set = this.sets.get(card.set);
			card.inheritProperties();
		}
		if (card.omit || card.set.omit) return;
		this.cards.set(card.id, card);
		this._enableCard(card);
		this.collector.emit('debug', `Registered card ${card.id}.`);
		this.collector.emit('cardRegister', card, this);
	}

	register(data)
	{
		if(!Array.isArray(data))
		{
			switch(typeof data)
			{
				case 'function':
				{
					data = new data();
					this.register(data);
					break;
				}
				case 'object':
				{
					if (data instanceof Card) this.registerCard(data);
					else if (data instanceof Set) this.registerSet(data);
					else if (typeof data.set !== 'undefined') this.registerCard(new Card(data));
					else if (typeof data.series !== 'undefined') this.registerSet(new Set(data));
					else throw new Error(`Unable to register object as a Card/Set`);
					break;
				}
				default: throw new Error(`Unable to register ${typeof data} as a Card/Set`);
			}
		}
		else
		{
			for (let v of data)
			{
				this.register(v);
			}
		}
	}

	registerIn(path)
	{
		let data = require('require-all')
		({
			dirname: path,
			filter: filename => 
			{
				if (filename.endsWith('.json') || filename.endsWith('.js')) return filename;
				else return false;
			},
		});
		for (let p in data)
		{
			this.register(data[p]);
		}
	}

	_enableSeries(series)
	{
		if (series.collectable && !this.collectable.has(series.id)) this.collectable.set(series.id, series);
		if (series.packable && !this.packable.has(series.id)) this.packable.set(series.id, series);
		if (series.mutatable && !this.mutatable.has(series.id)) this.mutatable.set(series.id, series);
	}

	_enableSet(set)
	{
		if (!set.series.sets.has(set.id)) set.series.sets.set(set.id, set);
		this._enableSeries(set.series);
	}

	_enableCard(card)
	{
		card.set.cards.set(card.id, card);
		this._enableSet(card.set);
	}
}