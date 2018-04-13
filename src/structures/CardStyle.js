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
	}

	addTextLayer(data = {})
	{
		if (typeof data !== 'object') data = {};
		if (typeof data.id === 'undefined') data.id = null;
		if (typeof data.text === 'undefined') data.text = 'No Text';
		if (typeof data.font === 'undefined') data.font = 'Arial';
		if (typeof data.size === 'undefined') data.size = 12;
		if (typeof data.color === 'undefined') data.color = '#000000';
		if (typeof data.width === 'undefined') data.width = Infinity;
	}
}