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
		if (typeof data.tags === 'undefined') data.tags = [];
		this.id = data.id;
		this.on = data.on;
		this.title = data.title;
		this.description = data.description;
		this.tags = data.tags;
		this.addLevel(0);
	}
	
	init(Collector)
	{
		this.collector = Collector;
		if (Array.isArray(this.on))
		{
			for (let v of this.on) {this.collector.on(v, (...args) => this.run(...args));}
		}
		else this.collector.on(this.on, (...args) => this.run(...args));
	}

	get max()
	{
		return this.size - 1;
	}
	
	addLevel(cost, callback = ()=>{}, startup = ()=>{})
	{
		this.set(this.size, {cost, callback, startup});
	}

	async run(...args)
	{
		let level = args[0].user.upgrades.get(this.id);
		if (level > this.max) level = this.max;
		this.get(level).callback(...args);
	}

	async startup(user)
	{
		let level = user.upgrades.get(this.id);
		this.get(level).startup.call(user);
	}

	compress()
	{
		let data = {};
		data.id = this.id;
		data.on = this.on;
		data.title = this.title;
		data.description = this.description;
		data.tags = this.tags;
		return data;
	}

	details(level = 0, splitter = '\n')
	{
		let items = [];
		items.push(`\`${this.id}\` **${this.title}**`);
		if (this.tags.length > 0 || this.description) items.push(`**~~-----------------------------------------------~~**`);
		if (level) items.push(`**Owend:** ${level > this.max ? `${level}/--` : `${level}/${this.max}`}`);
		if (this.tags.length > 0) items.push(`**Tags:** __${this.tags.join('__, __')}__`);
		if (this.description) items.push(`${this.description}`);
		return items.join(splitter);
	}

	line(options = {}, level = 0)
	{
		return Upgrade.line(this, options, level);
	}

	static line(upgrade, options = {}, level = 0)
	{
		if (typeof upgrade === 'string')
		{
			return Upgrade.line({id: upgrade, title: '__Unavailable__'});
		}
		if (typeof options.id === 'undefined') options.id = true;
		if (typeof options.title === 'undefined') options.title = true;
		let lines = [];
		if (options.id) lines.push(`\`${upgrade.id}\``);
		if (options.id) lines.push(`**${upgrade.title}**`);
		return lines.join(' ');
	}
}