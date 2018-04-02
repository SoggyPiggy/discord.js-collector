const EventEmitter = require('events').EventEmitter;
const Random = require('./random');

module.exports = class Cooldown extends EventEmitter
{
	constructor(options = {})
	{
		if (typeof options !== 'object') options = {};
		if (typeof options.timeout !== 'undefined') options.min = options.timeout;
		if (typeof options.min === 'undefined') options.min = 1000;
		if (typeof options.max === 'undefined') options.max = options.min;
		if (typeof options.cooldown === 'undefined') options.cooldown = 0;
		this.min = options.min;
		this.max = options.max;
		this.cooldown = options.cooldown;
		this.timeout = null;

		if (this.ready) this.emit('ready');
	}

	get ready()
	{
		return ((new Date().getTime()) >= this.cooldown);
	}

	get remainder()
	{
		return (this.cooldown - (new Date().getTime()))
	}
	
	trigger(override = false)
	{
		if (this.ready || override)
		{
			this.cooldown = (new Date().getTime()) + (Random.integer(this.min, this.max));
			this.timeout = clearTimeout(this.timeout);
			this.timeout = setTimeout(function(){this.emit('ready')}.bind(this), this.remainder);
			return true;
		}
		return false;
	}
	
	reset(emit = true)
	{
		this.timeout = clearTimeout(this.timeout);
		this.cooldown = 0;
		if (emit) this.emit('ready');
	}
	
	compress()
	{
		return {cooldown: this.cooldown};
	}
}