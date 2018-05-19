const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const diskdb = require('diskdb');
const CardRegistry = require('./CardRegistry');
const UserManager = require('./UserManager');
const Utils = require('./Utils');
const TradeManager = require('./TradeManager');
const CardStyles = require('./StyleRegistry');
const UpgradeRegistry = require('./UpgradeRegistry');

module.exports = class Collector extends EventEmitter
{
	constructor(options = {})
	{
		super();

		if (typeof options !== 'object') options = {};
		if (typeof options.admins === 'undefined') options.admins = [];
		if (typeof options.admins === 'string') options.admins = [options.admins];
		if (typeof options.cardIDPrefix === 'undefined') options.cardIDPrefix = '#';
		if (typeof options.cardIDLength === 'undefined') options.cardIDLength = 4;
		if (typeof options.cardIDFiller === 'undefined') options.cardIDFiller = '0';
		if (typeof options.setIDPrefix === 'undefined') options.setIDPrefix = '#';
		if (typeof options.setIDLength === 'undefined') options.setIDLength = 4;
		if (typeof options.setIDFiller === 'undefined') options.setIDFiller = '0';
		if (typeof options.creditPrefix === 'undefined') options.creditPrefix = '¤';
		if (typeof options.database === 'undefined') options.database = 'db/collector';
		if (typeof options.collectMinCooldown === 'undefined') options.collectMinCooldown = (1000 * 60 * 60 * 3);
		if (typeof options.collectMaxCooldown === 'undefined') options.collectMaxCooldown = (1000 * 60 * 60 * 6);
		if (typeof options.levelXP === 'undefined') options.levelXP = 100;
		if (typeof options.levelCredits === 'undefined') options.levelCredits = 200;
		if (typeof options.features !== 'object') options.features = {};
		if (typeof options.features.packs === 'undefined') options.features.packs = true;
		if (typeof options.features.managment === 'undefined') options.features.managment = true;
		if (typeof options.features.trading === 'undefined') options.features.trading = true;
		if (typeof options.features.market === 'undefined') options.features.market = false;
		if (typeof options.features.settings === 'undefined') options.features.settings = true;
		if (typeof options.packs !== 'object') options.packs = {};
		if (typeof options.packs.starter === 'undefined') options.packs.starter = 8;
		if (typeof options.packs.booster === 'undefined') options.packs.booster = 3;
		if (typeof options.packs.set === 'undefined') options.packs.set = options.packs.booster;
		if (typeof options.pricing !== 'object') options.pricing = {};
		if (typeof options.pricing.boosterpack === 'undefined') options.pricing.boosterpack = 400;
		if (typeof options.pricing.setpack === 'undefined') options.pricing.setpack = 600;
		if (typeof options.pricing.tradetax === 'undefined') options.pricing.tradetax = 0;
		if (typeof options.pricing.markettax === 'undefined') options.pricing.markettax = 0;
		if (typeof options.authorGratuity === 'undefined') options.authorGratuity = .2;
		if (typeof options.cardStyle === 'undefined') options.cardStyle = null;
		if (typeof options.renderer === 'undefined') options.renderer = require('./renderers/canvas');
		if (typeof options.grindPercent === 'undefined') options.grindPercent = .5;

		this.options = options;
		this.structures = require('./Structures');

		if (!fs.existsSync(path.join(options.database))) mkdirp.sync(path.join(options.database));
		this.db = diskdb.connect(path.join(options.database));

		this.utils = new Utils(this);
		this.users = new UserManager(this);
		this.registry = new CardRegistry(this);
		this.cardstyles = new CardStyles(this);
		this.trades = new TradeManager(this);
		this.upgrades = new UpgradeRegistry(this);
		
		this.series = this.registry.series;
		this.sets = this.registry.sets;
		this.cards = this.registry.cards;
	}

	registerDefaults()
	{
	}

	registerCommando(client)
	{
		this.Commando = client;

		client.registry.registerGroup('collector_basic', 'Collector: Basics');
		client.registry.registerCommand(new (require('./commands/basics/collect'))(client, this));
		client.registry.registerCommand(new (require('./commands/basics/collection'))(client, this));

		client.registry.registerGroup('collector_card', 'Collector: Card Basics');
		client.registry.registerCommand(new (require('./commands/card/display'))(client, this));
		client.registry.registerCommand(new (require('./commands/card/card'))(client, this));
		client.registry.registerCommand(new (require('./commands/card/cards'))(client, this));

		client.registry.registerGroup('collector_sets', 'Collector: Set Basics');
		client.registry.registerCommand(new (require('./commands/set/set'))(client, this));
		client.registry.registerCommand(new (require('./commands/set/sets'))(client, this));

		client.registry.registerGroup('collector_credits', 'Collector: Credit Basics');
		client.registry.registerCommand(new (require('./commands/credit/balance'))(client, this));
		client.registry.registerCommand(new (require('./commands/credit/transfer'))(client, this));

		if (this.options.features.packs)
		{
			client.registry.registerGroup('collector_packs', 'Collector: Card Packs');
			client.registry.registerCommand(new (require('./commands/packs/starter'))(client, this));
			client.registry.registerCommand(new (require('./commands/packs/booster'))(client, this));
			client.registry.registerCommand(new (require('./commands/packs/set'))(client, this));
		}

		if (this.options.features.managment)
		{
			client.registry.registerGroup('collector_managment', 'Collector: Card Managment');
			client.registry.registerCommand(new (require('./commands/managment/grindx'))(client, this));
			client.registry.registerCommand(new (require('./commands/managment/grinddupe'))(client, this));
			client.registry.registerCommand(new (require('./commands/managment/grindall'))(client, this));
		}

		if (this.options.features.trading)
		{
			client.registry.registerGroup('collector_trading', 'Collector: Trading');
			client.registry.registerCommand(new (require('./commands/trading/offer'))(client, this));
			client.registry.registerCommand(new (require('./commands/trading/accept'))(client, this));
			client.registry.registerCommand(new (require('./commands/trading/decline'))(client, this));
			client.registry.registerCommand(new (require('./commands/trading/trade'))(client, this));
			client.registry.registerCommand(new (require('./commands/trading/trades'))(client, this));
		}

		if (this.options.features.market)
		{
			client.registry.registerGroup('collector_market', 'Collector: Market');
			client.registry.registerCommand(new (require('./commands/market/buy'))(client, this));
			client.registry.registerCommand(new (require('./commands/market/sell'))(client, this));
			client.registry.registerCommand(new (require('./commands/market/cancel'))(client, this));
			client.registry.registerCommand(new (require('./commands/market/history'))(client, this));
			client.registry.registerCommand(new (require('./commands/market/listing'))(client, this));
			client.registry.registerCommand(new (require('./commands/market/listings'))(client, this));
		}

		if (this.options.features.settings)
		{
			client.registry.registerGroup('collector_settings', 'Collector: Settings');
			client.registry.registerCommand(new (require('./commands/settings/cardstyle'))(client, this));
		}

		client.registry.registerGroup('collector_informative', 'Collector: Help Center');
		client.registry.registerCommand(new (require('./commands/informative/startup'))(client, this));
		client.registry.registerCommand(new (require('./commands/informative/search'))(client, this));
		client.registry.registerCommand(new (require('./commands/informative/searchcs'))(client, this));
	}
}