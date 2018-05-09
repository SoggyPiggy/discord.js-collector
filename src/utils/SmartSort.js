module.exports =
{
	cards: cards =>
	{
		cards.sort((a, b) =>
		{
			if (Array.isArray(a)) a = a[1];
			if (Array.isArray(b)) b = b[1];
			if (typeof a === 'string' && typeof b === 'string')
			{
				if (a > b) return 1;
				else if (a < b) return -1;
				else return 0;
			}
			if (typeof a !== 'object')
			{
				if (typeof b !== 'object') return 0;
				else return 1;
			}
			if (typeof b !== 'object') return -1;
			if (a.set.series.id === b.set.series.id)
			{
				if (a.id > b.id) return 1;
				else if (a.id < b.id) return -1;
				else return 0;
			}
			if (a.set.series.value === 0 && b.set.series.value !== 0) return 1;
			if (a.set.series.value !== 0 && b.set.series.value === 0) return -1;
			return a.set.series.value - b.set.series.value;
		})
	},
	card: this.cards,
	sets: sets =>
	{
		sets.sort((a, b) =>
		{
			if (Array.isArray(a)) a = a[1];
			if (Array.isArray(b)) b = b[1];
			if (a.series.id === b.series.id)
			{
				if (a.value === b.value)
				{
					if (a.id > b.id) return 1;
					else if (a.id < b.id) return -1;
					else return 0;
				}
				if (a.value === 0 && b.value !== 0) return 1;
				if (a.value !== 0 && b.value === 0) return -1;
				return a.value - b.value;
			}
			if (a.series.value === 0 && b.series.value !== 0) return 1;
			if (a.series.value !== 0 && b.series.value === 0) return -1;
			return a.series.value - b.series.value;
		})
	},
	set: this.sets,
	offers: offers =>
	{
		offers.sort((a, b) =>
		{
			if (Array.isArray(a)) a = a[1];
			if (Array.isArray(b)) b = b[1];
			return (a.created > b.created) - (a.created < b.created);
		})
	},
	offer: this.offers,
}
