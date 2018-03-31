const EventEmitter = require('events');
const CardRegistry = require('./CardRegistry');
const Utils = require('./utils/Utils');

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
		if (typeof options.creditPrefix === 'undefined') options.creditPrefix = '¤';
		if (typeof options.features === 'undefined') options.features = {};
		if (typeof options.features.packs === 'undefined') options.features.packs = true;
		if (typeof options.features.credits === 'undefined') options.features.credits = true;
		if (typeof options.features.managment === 'undefined') options.features.managment = true;
		if (typeof options.features.credits === 'undefined') options.features.credits = true;
		if (typeof options.features.trading === 'undefined') options.features.trading = true;
		if (typeof options.features.market === 'undefined') options.features.market = true;
		if (typeof options.pricing === 'undefined') options.pricing = {};
		if (typeof options.pricing.boosterpack === 'undefined') options.pricing.boosterpack = 400;
		if (typeof options.pricing.setpack === 'undefined') options.pricing.setpack = 600;
		if (typeof options.pricing.tradetax === 'undefined') options.pricing.tradetax = 0;
		if (typeof options.pricing.markettax === 'undefined') options.pricing.markettax = 0;
		this.options = options;
		this.registry = new CardRegistry(this);
		this.utils = new Utils(this);
	}

	registerCommando(client)
	{
		this.Commando = client;

		client.registry.registerGroup('collector_basic', 'Collector: Basics');
		client.registry.registerCommand(new (require('./src/commands/basics/collect'))(client, this));
		client.registry.registerCommand(new (require('./src/commands/basics/collection'))(client, this));

		client.registry.registerGroup('collector_card', 'Collector: Card Basics');
		client.registry.registerCommand(new (require('./src/commands/card/display'))(client, this));
		client.registry.registerCommand(new (require('./src/commands/card/info'))(client, this));
		client.registry.registerCommand(new (require('./src/commands/card/cards'))(client, this));

		client.registry.registerGroup('collector_sets', 'Collector: Set Basics');
		client.registry.registerCommand(new (require('./src/commands/set/info'))(client, this));
		client.registry.registerCommand(new (require('./src/commands/set/sets'))(client, this));

		if (this.options.features.credits)
		{
			client.registry.registerGroup('collector_credits', 'Collector: Credit Basics');
			client.registry.registerCommand(new (require('./src/commands/credit/balance'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/credit/transfer'))(client, this));
		}

		if (this.options.features.packs)
		{
			client.registry.registerGroup('collector_packs', 'Collector: Card Packs');
			client.registry.registerCommand(new (require('./src/commands/packs/starter'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/packs/booster'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/packs/set'))(client, this));
		}

		if (this.options.features.managment)
		{
			client.registry.registerGroup('collector_managment', 'Collector: Card Managment');
			client.registry.registerCommand(new (require('./src/commands/managment/grindx'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/managment/grinddupe'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/managment/grindall'))(client, this));
		}

		if (this.options.features.trading)
		{
			client.registry.registerGroup('collector_trading', 'Collector: Trading');
			client.registry.registerCommand(new (require('./src/commands/trading/trade'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/trading/accept'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/trading/decline'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/trading/info'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/trading/offers'))(client, this));
		}

		if (this.options.features.market)
		{
			client.registry.registerGroup('collector_market', 'Collector: Market');
			client.registry.registerCommand(new (require('./src/commands/market/buy'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/market/sell'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/market/cancel'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/market/history'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/market/info'))(client, this));
			client.registry.registerCommand(new (require('./src/commands/market/listings'))(client, this));
		}

		client.registry.registerGroup('collector_informative', 'Collector: Help Center');
		client.registry.registerCommand(new (require('./src/commands/informative/news'))(client, this));
		client.registry.registerCommand(new (require('./src/commands/informative/startup'))(client, this));
		client.registry.registerCommand(new (require('./src/commands/informative/search'))(client, this));
	}
}