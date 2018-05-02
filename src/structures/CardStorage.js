const CardCollection = require('./CardCollection');

module.exports = class CardStorage extends CardCollection
{
	constructor(Collector, data, user)
	{
		super(Collector, data)
		this.user = user;
	}

	deposit(card, count)
	{
      this.user.cards.remove(card, count);
      this.add(card, count);
   }
   
   withdrawal(card, count)
   {
      this.user.cards.add(card, count);
      this.remove(card, count);
   }
}