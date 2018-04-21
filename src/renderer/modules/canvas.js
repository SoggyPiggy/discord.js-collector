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
const Request = require('then-request');

function processImage(ctx, layer)
{
	return new Promise(resolve, reject)
	{
		let image;
		try
		{
			if (layer.content.match(/^https?:/))
			{
				let request = await Request('GET', layer.content);
				image = new Canvas.Image();
				image.src = request.body;
			}
			else
			{
				image = await Canvas.loadImage(layer.content);
			}
		}
		catch(error)
		{
			if (!layer.fallback) reject(error);
			image = await Canvas.loadImage(layer.fallback);
		}
		ctx.translate(layer.x, layer.y);
		let width;
		let height;
		if (layer.width === null) width = image.width;
		else width = layer.width;
		if (layer.height === null) width = image.height;
		else width = layer.height;
		ctx.drawImage(image, 0, 0, width, height);
		resolve();
	}
}

function processLayer(ctx, layer)
{
	switch (layer.type)
	{
		case 'image': return processImage(ctx, layer);
		case 'text': return processText(ctx, layer);
		case 'rect': return processRectangle(ctx, layer);
		default: return;
	}
}

module.exports = function (cardstyle, data)
{
	return new Promise(function(resolve, reject)
	{
		let canvas = new Canvas(cardstyle.width, cardstyle.height);
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = cardstyle.options.defaults.color;
		ctx.font = `${cardstyle.options.defaults.size}px '${cardstyle.options.defaults.font}'`;
		for (let layer of cardstyle.layers)
		{
			if (layer.validate)
			{
				if (!layer.validate(data)) continue;
			}
			let content;
			if (typeof layer.content === 'function') content = layer.content(data);
			else content = layer.content;
			if (!data) continue;
			ctx.save();
			await processLayer(layer, data);
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
	})
}