const EventEmitter = require('events');

module.exports = class Collector extends EventEmitter
{
	constructor(options = {})
	{
		super();
	}
}