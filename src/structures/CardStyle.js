module.exports = class CardStyle
{
	/**
	 * Options for a Card Style
	 * @typedef {StyleOptions} CollectorStyleOptions
	 * @property {string} [id] - The ID of the Style. IDs are used for cataloging and must be unique.
	 * @property {string} [number] - The friendly name of the Card Style.
	 * @property {number} [width] - The width of the Style (Card Width).
	 * @property {number} [height] - The height of the Style (Card Height).
	 * @property {string} [description] - A little brief explanation for the Style
	 */

	/**
	 * 
	 * @param {CollectorStyleOptions} [options] 
	 */
	constructor(options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.id === 'undefined') throw new Error('Card Style missing ID.');
		if (typeof options.title === 'undefined') throw new Error('Card Style missing Title.');
		if (typeof options.width === 'undefined') throw new Error('Card Style missing Width.');
		if (typeof options.height === 'undefined') throw new Error('Card Style missing Height.');
		if (typeof options.description === 'undefined') options.description = null;
		if (typeof options.defaults !== 'object') options.defaults = {};
		if (typeof options.defaults.x === 'undefined') options.defaults.x = 0;
		if (typeof options.defaults.y === 'undefined') options.defaults.y = 0;
		if (typeof options.defaults.font === 'undefined') options.defaults.font = 'Arial';
		if (typeof options.defaults.size === 'undefined') options.defaults.size = 12;
		if (typeof options.defaults.color === 'undefined') options.defaults.color = '#000000';
		if (typeof options.defaults.alpha === 'undefined') options.defaults.alpha = 1;
		if (typeof options.defaults.shrink === 'undefined') options.defaults.shrink = false;
		this.id = options.id;
		this.title = options.title;
		this.width = options.width;
		this.height = options.height;
		this.options = options;
		this.layers = [];
	}

	addLayer(options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.x === 'undefined') options.x = this.options.defaults.x;
		if (typeof options.y === 'undefined') options.y = this.options.defaults.y;
		if (typeof options.color === 'undefined') options.color = this.options.defaults.color;
		if (typeof options.alpha === 'undefined') options.alpha = this.options.defaults.alpha;
		if (typeof options.width === 'undefined') options.width = null;
		if (typeof options.height === 'undefined') options.height = null;
		if (typeof options.validate === 'undefined') options.validate = null;
		if (typeof options.fallback === 'undefined') options.fallback = null;
		if (!options.content) return;
		this.layers.push(options);
	}
	
	addTextLayer(text, options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.font === 'undefined') options.font = this.options.defaults.font;
		if (typeof options.size === 'undefined') options.size = this.options.defaults.size;
		if (typeof options.shrink === 'undefined') options.shrink = this.options.defaults.shrink;
		options.content = text;
		options.type = 'text';
		this.addLayer(options);
	}

	addImageLayer(url, options = {})
	{
		if (typeof options !== 'object') options = {};
		options.content = url;
		options.type = 'image';
		this.addLayer(options);
	}

	addRectLayer(options = {})
	{
		if (typeof options !== 'object') options = {};
		options.content = true;
		options.type = 'rect';
		this.addLayer(options);
	}

	render(card, options = {})
	{
		return new Promise(async (resolve, reject) =>
		{
			if (typeof options !== 'object') options = {};
			if (typeof options.new === 'undefined') options.new = false;
			if (typeof options.user === 'undefined') options.user = null;

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
				data.author.user = this.collector.users.get(card.author, false);
				data.author.member = await this.collector.Commando.users.fetch(card.author);
			}
			try
			{
				let renderer = await this.collector.options.renderer;
				let buffer = await renderer(this, data);
				resolve(buffer);
			}
			catch(error)
			{
				reject(error);
			}
		})
	}
}