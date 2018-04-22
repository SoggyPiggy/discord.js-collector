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

function processRect(ctx, content, layer)
{
	return new Promise((resolve) =>
	{
		ctx.translate(layer.x, layer.y);
		ctx.fillStyle = layer.color;
		ctx.fillRect(0, 0, layer.width, layer.height);
		resolve();
	});
}

function processText(ctx, content, layer)
{
	return new Promise((resolve, reject) =>
	{
		ctx.translate(layer.x, layer.y);
		ctx.fillStyle = layer.color;
		ctx.font = `${layer.size}px '${layer.font}'`;
		if (layer.width)
		{
			if (layer.shrink)
			{
				ctx.fillText(content, 0, 0, layer.width);
				resolve();
			}
			let width = ctx.measureText(content).width;
			while (width > layer.width)
			{
				content = content.slice(0, -1);
				width = ctx.measureText(content).width;
			}
		}
		ctx.fillText(content, 0, 0);
		resolve();
	})
}

function processImage(ctx, content, layer)
{
	return new Promise((resolve, reject) =>
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
	});
}

function processLayer(ctx, content, layer)
{
	switch (layer.type)
	{
		case 'image': return processImage(ctx, content, layer);
		case 'text': return processText(ctx, content, layer);
		case 'rect': return processRectangle(ctx, content, layer);
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
			if (!content && !layer.fallback) continue;
			ctx.save();
			await processLayer(ctx, content, layer);
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