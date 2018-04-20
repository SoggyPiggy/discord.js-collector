module.exports =
{
	cards: function(cards)
	{
		cards.sort(function (a, b)
		{
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
	sets: function(sets)
	{
		sets.sort(function (a, b)
		{
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
	}
}
