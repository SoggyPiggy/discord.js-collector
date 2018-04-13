const CardStyle = require('./../../structures/CardStyle');

module.exports = class extends CardStyle
{
	constructor()
	{
		super
		({
			id: 'collector',
			title: 'Collector',
			description: 'The standard Collector card style.',
			width: 200,
			height: 276
		})

		this.addTextLayer()
	}
}