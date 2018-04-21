const CardStyle = require('./structures/CardStyle');

let getRenderer = function ()
{ }

module.exports = class StyleRegistry extends Map
{
	constructor(collector)
	{
		super();
		this.collector = collector;
		this.renderer = this.collector.options.renderer;
		this.renderers = new Map();
		this.renderers.set('canvas', './renderer/modules/canvas');
		this.renderers.set('canvas-prebuilt', './renderer/modules/canvas');
		this.renderers.set('jimp', './renderer/modules/jimp');
	}

	registerStyle(style)
	{
		if (typeof style === 'undefined') return;
		if (typeof style === 'function') style = style(this.collector);
		if (!(style instanceof CardStyle)) return;
		this.set(style.id, style);
	}

	registerDefaultStyle()
	{
		this.registerStyle(require('./renderer/styles/collectorV1'));
		if (this.collector.options.cardstyle === null) this.collector.options.cardstyle = 'collector';
	}

	render(card, options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.new === 'undefined') options.new = false;
		if (typeof options.user === 'undefined') options.user = null;
		let style = this.get();
		if (!style)
		{
			this.collector.emit('warn', 'Attempted to render card without a default card style set.');
			return false;
		}
		return new Promise(resolve =>
		{
			let data = {};
			data.card = card;
			data.set = card.set;
			data.series = card.set.series;
			data.$set = card.$set;
			data.$series = card.$set.series;
			data.new = options.new;
			if (card.author)
			{
				data.author = {};
				data.user = collector.users.get(card.author, false);
				data.member = await client.fetchUser(card.author);
			}
			let renderer = this.renderers.get(this.renderer);
			renderer = require(renderer);
			resolve(renderer(style, data))
		});
	}

	get(id)
	{
		return super.get(id) || super.get(this.collector.options.cardstyle);
	}
}