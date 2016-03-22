// Exports
module.exports.builder = builder;
module.exports.handler = handler;
module.exports.auth = auth;

// Constants
const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const OAUTH_VERSION = '1.0';
const HASH_VERSION = 'HMAC-SHA1';

// Dependencies
var OAuth = require('oauth');
var open = require('open');
var prompt = require('prompt');
var cfg = require('home-config').load('.tlmrc');

function builder (yargs) {
	yargs
		.usage('\nUsage: auth [options]')
		.describe('key', 'Your Twitter oAuth consumer key')
		.describe('secret', 'Your Twitter oAuth consumer secret')
		.string('key')
		.string('secret');

	if (!cfg.oauth_consumer_key) yargs.demand('key', 'You must provide your own Twitter oAuth consumer key. You only need to do this once.');
	if (!cfg.oauth_consumer_secret) yargs.demand('secret', 'You must provide your own Twitter oAuth consumer secret. You only need to do this once.');

	return yargs;
}

function handler (yargs) {
	// Save consumer key and secret for later
	cfg.oauth_consumer_key = yargs.key || cfg.oauth_consumer_key;
	cfg.oauth_consumer_secret = yargs.secret || cfg.oauth_consumer_secret;
	cfg.save();

	auth(function(err, d){
		if (err) {
			console.log(err);
		};
		console.log(d);
	});
}

function auth(callback) {

	var oa;

	if (!cfg.oauth_consumer_key || !cfg.oauth_consumer_secret) {
		return callback(new Error('Twitter consumer key and secret not set'));
	}

	oa = new OAuth.OAuth(REQUEST_TOKEN_URL, ACCESS_TOKEN_URL, cfg.oauth_consumer_key, cfg.oauth_consumer_secret, OAUTH_VERSION , null, HASH_VERSION);

	oa.getOAuthRequestToken(handleRequestToken);

	function handleRequestToken(err, oauth_token, oauth_token_secret, results){

		if (err) {
			return callback(err);
		}

		open('https://twitter.com/oauth/authorize?oauth_token=' + oauth_token);

		prompt.start();
		prompt.message = '';
		prompt.delimiter = '';
		prompt.get({properties: {pin: {
			message: "Enter the PIN from Twitter: "
		}}}, handlePin);

		function handlePin (err, input) {
			if (err) {
				return callback(err);
			}

			oa.getOAuthAccessToken(oauth_token, oauth_token_secret, input.pin, handleAccessToken);
		}
	}

	function handleAccessToken (err, oauth_access_token, oauth_access_token_secret, results2) {
		if (err) {
			return (parseInt(error.statusCode) == 401) ?
				callback(new Error('The pin number you have entered is incorrect')) :
				callback(err);
		}

		cfg.oauth_access_token_key = oauth_access_token;
		cfg.oauth_access_token_secret = oauth_access_token_secret;
		cfg.save();

		callback({
			consumer_key: cfg.oauth_consumer_key,
			consumer_secret: cfg.oauth_consumer_secret,
			access_token_key: cfg.oauth_access_token_key,
			access_token_secret: cfg.oauth_access_token_secret
		});
	}
}
