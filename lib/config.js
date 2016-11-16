// TODO: Move this to utils?
var cfg, key;

cfg = require('home-config').load('.twrc');

module.exports = new Proxy(cfg, {
	get: (cfg, prop) => {
		return process.env[`TWITTER_${String(prop).toUpperCase()}`] || cfg[prop];
	}
});