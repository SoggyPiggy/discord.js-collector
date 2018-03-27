const RandomJS = rquire('random-js');
const random = new RandomJS(RandomJS.engines.browserCrypto);
module.exports = random;