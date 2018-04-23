module.exports = function(collector)
{
	return new Promise(resolve =>
	{
		try
		{
			require.resolve('canvas');
			collector.emit('debug', 'Canvas detected.');
			resolve('canvas');
		}
		catch(e){}
		try
		{
			require.resolve('canvas-prebuilt');
			collector.emit('debug', 'Canvas-Prebuilt detected.');
			resolve('canvas-prebuilt');
		}
		catch(e){}
		try
		{
			require.resolve('jimp');
			collector.emit('debug', 'Jimp detected.');
			collector.emit('warn', 'Jimp has less funtionality for fonts.\nCanvas, or Canvas-Prebuilt is reccomended.');
			resolve('jimp');
		}
		catch(e){}
		collector.emit('debug', 'No renderer detected.\nCanvas or Canvas-Prebuilt is reccomended.');
		collector.emit('warn', 'No renderer detected.\nCanvas or Canvas-Prebuilt is reccomended.');
		resolve(null);
	});
}