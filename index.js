const EventEmitter = require('events');

module.exports = class Collector extends EventEmitter
{
	constructor(options = {})
	{
		super();

		if (typeof options.cardIDPrefix === 'undefined') options.cardIDPrefix = '#';
		if (typeof options.cardIDLength === 'undefined') options.cardIDLength = 4;
		if (typeof options.cardIDFiller === 'undefined') options.cardIDFiller = '0';
		if (typeof options.setIDPrefix === 'undefined') options.setIDPrefix = '#';
		if (typeof options.setIDLength === 'undefined') options.setIDLength = 4;
		if (typeof options.setIDFiller === 'undefined') options.setIDFiller = '0';
		if (typeof options.features === 'undefined') options.features = {};
		if (typeof options.features.packs === 'undefined') options.features.packs = true;
		if (typeof options.features.credits === 'undefined') options.features.credits = true;
		if (typeof options.features.managment === 'undefined') options.features.managment = true;
		if (typeof options.features.credits === 'undefined') options.features.credits = true;
		if (typeof options.features.trading === 'undefined') options.features.trading = true;
		if (typeof options.features.market === 'undefined') options.features.market = true;
		this.options = options;
	}
}