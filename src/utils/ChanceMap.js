const Random = require('./random');

module.exports = class extends Map
{
	constructor()
	{
		super();
		this._reset();
	}

	clear()
	{
		super.clear();
		this._reset();
	}

	delete(key)
	{
		super.delete(key);
		this._update();
	}

	set(key, value)
	{
		if (typeof value.chance === 'undefined') throw new Error('Value must possess a Number chance property');
		if (this.has(key))
		{
			super.set(key, value);
			this._update();
		}
		else
		{
			super.set(key, value);
			this._addChance(value.chance);
			this._updateModifiers();
		}
	}

	random(modifier = 0)
	{
		let random = Random.real(0, this._total, true)
		let weight = 0;
		for (let value of this.values())
		{
			weight += this._modifyChance(modifier, value.chance);
			if (random <= weight) return value;
		}
	}

	_reset()
	{
		this._total = 0;
		this._min = Infinity;
		this._max = -Infinity;
		this._minModifier = 0;
		this._maxModifier = 0;
	}

	_update()
	{
		this._reset();
		for (let value of this.values())
		{
			this._addChance(value.chance);
		}
		this._updateModifiers();
	}

	_addChance(chance)
	{
		this._total += chance;
		if (chance < this._min) this._min = chance;
		if (chance > this._max) this._max = chance;
	}

	_updateModifiers()
	{
		this._minModifier = (-this._min) / ((this._total / this.size) - this._min);
		this._maxModifier = (-this._max) / ((this._total / this.size) - this._max);
		if (this._minModifier === Infinity || this._minModifier === -Infinity) this._minModifier = 0;
		if (this._maxModifier === Infinity || this._maxModifier === -Infinity) this._maxModifier = 0;
	}

	_modifyChance(modifier, chance)
	{
		if (modifier == 0 || this._minModifier == 0 && this._maxModifier == 0) return chance;
		let mod;
		if (modifier > 1) modifier = 1;
		if (modifier < -1) modifier = -1;
		if (modifier > 0) mod = this._minModifier * Math.abs(modifier);
		if (modifier < 0) mod = this._maxModifier * Math.abs(modifier);
		return (this._total / this.size - chance) * mod + chance;
	}
}