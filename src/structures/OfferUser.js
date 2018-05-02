const CardCollection = require('./CardCollection');

modules.exports = class OfferUser
{
    constructor(Collector, data)
    {
        this.collector = Collector;
        if (typeof data.id === 'undefined') throw new Error('ID must be defined');
        this.id = data.id;
        this.user = Collector.users.get(data.id)
        this.offers = data.offers;
        this.offers = data.offers;
        // this.
    }
}