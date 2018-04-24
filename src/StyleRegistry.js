const CardStyle = require('./structures/CardStyle');

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
		if (typeof style === 'function') style = new style();
		if (!(style instanceof CardStyle)) return;
		style.collector = this.collector;
		if (this.collector.options.cardStyle === null) this.collector.options.cardStyle = style.id;
		this.set(style.id, style);
	}

	registerDefaultStyle()
	{
		this.registerStyle(require('./renderer/styles/collectorV1'));
	}

	get(id)
	{
		if (typeof id !== 'undefined') return super.get(id);
		return super.get(this.collector.options.cardStyle);
	}
}