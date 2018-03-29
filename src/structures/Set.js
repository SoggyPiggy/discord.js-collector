const Card = require('./Card');

module.exports = class Set
{
	constructor(data = {})
	{
		if (typeof data					!== 'object')		throw new Error('Set data must be an object');
		if (typeof data.id				=== 'undefined')	throw new Error('Set missing ID');
		if (typeof data.title			=== 'undefined')	data.title			= 'undefined';
		if (typeof data.chance			=== 'undefined')	data.chance			= 100;
		if (typeof data.author			=== 'undefined')	data.author			= null;
		if (typeof data.description	=== 'undefined')	data.description	= null;
		if (typeof data.author			=== 'undefined')	data.author			= null;
		if (typeof data.purchasable	=== 'undefined')	data.purchasable	= null;
		if (typeof data.tags				=== 'undefined')	data.tags			= [];

		this.id				= data.id;
		this.title			= data.title;
		this.chance			= data.chance;
		this.author			= data.author;
		this.description	= data.description;
		this.author			= data.author;
		this.purchasable	= data.purchasable;
		this.tags			= data.tags;
	}
}