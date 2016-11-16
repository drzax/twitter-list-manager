var Twitter = require('twitter');
var cfg = require('../config');

// Setup twitter client
var T = new Twitter({
	consumer_key: cfg.oauth_consumer_key,
	consumer_secret: cfg.oauth_consumer_secret,
	access_token_key: cfg.oauth_access_token_key,
	access_token_secret: cfg.oauth_access_token_secret
});

T.me = {
	screen_name: cfg.screen_name,
	user_id: cfg.user_id
};

module.exports = T;
