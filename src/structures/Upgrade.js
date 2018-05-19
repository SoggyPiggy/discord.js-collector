module.exports = class Upgrade extends Map
{
	constructor(data = {})
	{
		super();
		if (typeof data !== 'object') data = {};
		if (typeof data.id === 'undefined') throw new Error('Upgrade must have a ID');
		if (typeof data.on === 'undefined') throw new Error(`Upgrade ${data.id} must have a 'on' property to attach to`);
		if (typeof data.title === 'undefined') data.title = 'Untitled';
		if (typeof data.description === 'undefined') data.description = null;
		this.id = data.id;
		this.on = data.on;
		this.title = data.title;
		this.description = data.description;
		this.addLevel(0, ()=>{});
	}
	
	init(Collector)
	{
		this.collector = Collector;
		if (Array.isArray(this.on))
		{
			for (let v of this.on) {this.collector.on(v, this.run.bind(this));}
		}
		else this.collector.on(this.on, this.run.bind(this));
	}

	get max()
	{
		return this.size - 1;
	}
	
	addLevel(cost, callback)
	{
		this.set(this.size, {cost, callback});
	}

	async run(...args)
	{
		let level = user.upgrades.get(this.id);
		this.get(level).callback.call(...args);
	}
}