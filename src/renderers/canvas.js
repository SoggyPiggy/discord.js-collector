var Canvas;
try
{
	let c = require('canvas');
	Canvas = c;
}
catch (error)
{
	try
	{
		let c = require('canvas-prebuilt');
		Canvas = c;
	}
	catch (error2) {}
}

function processRect(ctx, content, layer)
{
	return new Promise(async (resolve) =>
	{
		try
		{
			ctx.translate(layer.x, layer.y);
			ctx.globalCompositeOperation = layer.operation;
			ctx.fillStyle = layer.color;
			ctx.globalAlpha = layer.alpha;
			ctx.fillRect(0, 0, layer.width, layer.height);
			resolve();
		}
		catch(error){reject(error)}
	});
}

function processText(ctx, content, layer)
{
	return new Promise(async (resolve, reject) =>
	{
		try
		{
			ctx.translate(layer.x, layer.y);
			ctx.globalCompositeOperation = layer.operation;
			ctx.fillStyle = layer.color;
			ctx.globalAlpha = layer.alpha;
			ctx.font = `${layer.variant} ${layer.style} ${layer.weight} ${layer.size}px '${layer.font}'`;
			let width = ctx.measureText(content).width;
			if (layer.width)
			{
				if (layer.shrink)
				{
					ctx.fillText(content, 0, 0, layer.width);
					resolve();
				}
				while (width > layer.width)
				{
					content = content.slice(0, -1);
					width = ctx.measureText(content).width;
				}
			}
			if (layer.anchor !== 0) ctx.translate(-Math.round(width * layer.anchor), 0);
			ctx.fillText(content, 0, 0);
			resolve();
		}
		catch(error){reject(error)}
	})
}

function processImage(ctx, content, layer)
{
	return new Promise(async (resolve, reject) =>
	{
		try
		{
			let image;
			try
			{
				if (content.match(/^https?:/))
				{
					let request = await (require('then-request'))('GET', content);
					image = new Canvas.Image();
					image.src = request.body;
				}
				else
				{
					image = await Canvas.loadImage(content);
				}
			}
			catch(error)
			{
				if (!layer.fallback) reject(error);
				image = await Canvas.loadImage(layer.fallback);
			}
			let width;
			let height;
			if (layer.width === null) width = image.width;
			else width = layer.width;
			if (layer.height === null) height = image.height;
			else height = layer.height;
			ctx.globalAlpha = layer.alpha;
			ctx.translate(layer.x, layer.y);
			ctx.globalCompositeOperation = layer.operation;
			ctx.drawImage(image, 0, 0, width, height);
			resolve();
		}
		catch(error){reject(error)}
	});
}

function processLayer(ctx, content, layer)
{
	switch (layer.type)
	{
		case 'image': return processImage(ctx, content, layer);
		case 'text': return processText(ctx, content, layer);
		case 'rect': return processRect(ctx, content, layer);
		default: return;
	}
}

function renderCard(cardstyle, data)
{
	return new Promise(async (resolve, reject) =>
	{
		try
		{
			let canvas = new Canvas.createCanvas(cardstyle.width, cardstyle.height);
			let ctx = canvas.getContext('2d');
			for (let layer of cardstyle.layers)
			{
				if (layer.validate)
				{
					if (!layer.validate(data)) continue;
				}
				let content;
				if (typeof layer.content === 'function') content = layer.content(data);
				else content = layer.content;
				if (!content && !layer.fallback) continue;
				ctx.save();
				try
				{
					await processLayer(ctx, content, layer);
				}
				catch(error) {console.warn(error);}
				ctx.restore();
			}
			try
			{
				let buffer = canvas.toBuffer();
				resolve(buffer);
			}
			catch (error)
			{
				reject(error);
			}
		}
		catch(error){reject(error)}
	})
}

function renderPack(cardstyle, datas)
{
	return new Promise(async (resolve, reject) =>
	{
		let cards = [];
		for (let data of datas)
		{
			try
			{
				let image = new Canvas.Image();
				image.src = await renderCard(cardstyle, data);
				cards.push(image);
			}
			catch(error){}
		}
		if (cards.length <= 0) return resolve(null);
		let gap = Math.ceil(cardstyle.width * .025);
		let width = (cardstyle.width * cards.length) + (gap * (cards.length - 1));
		try
		{
			let canvas = Canvas.createCanvas(width, cardstyle.height);
			let ctx = canvas.getContext('2d');
			ctx.drawImage(cards[0], 0, 0);
			for (let i = 1; i < cards.length; i++)
			{
				ctx.drawImage(cards[i], ((cardstyle.width * i) + (gap * i)), 0);
			}
			let buffer = canvas.toBuffer();
			resolve(buffer);
		}
		catch(error){reject(error)};
	})
}

module.exports = {card: renderCard, pack: renderPack, addFont: Canvas.registerFont};