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
var cfg = require('./config');

function builder (yargs) {
	yargs
		.usage('\nUsage: tw auth [options]\n\nDon\'t have a key or secret? Setup an app here: https://apps.twitter.com/')
		// TODO: this has to be interactive to accept pin anyway so might as well make key and secret interactive too.
		.describe('key', 'Your Twitter oAuth consumer key')
		.describe('secret', 'Your Twitter oAuth consumer secret')
		.describe('delete', 'Remove the auth credentials from disk')
		.string('key')
		.string('secret')
		.boolean('delete');

	return yargs;
}

function handler (yargs) {

	var properties = {};

	if (yargs.delete) {
		for (var key in cfg) {
			if (cfg.hasOwnProperty(key) && key !== '__filename'){
				delete cfg[key];
			}
		}
		cfg.save();
		return;
	}

	// Save consumer key and secret for later
	cfg.oauth_consumer_key = yargs.key || cfg.oauth_consumer_key;
	cfg.oauth_consumer_secret = yargs.secret || cfg.oauth_consumer_secret;
	cfg.save();

	// Prompt for missing things
	if (!cfg.oauth_consumer_key) {
		properties.key = {
			message: "Enter your oAuth consumer key: "
		};
	}

	if (!cfg.oauth_consumer_secret) {
		properties.secret = {
			message: "Enter your oAuth consumer secret: "
		};
	}

	if (!cfg.oauth_consumer_secret || !!cfg.oauth_consumer_key) {
		prompt.start();
		prompt.message = '';
		prompt.delimiter = '';
		prompt.get({properties: properties}, (err, input) => {
			if (err) throw err;
			for (var key in input) {
				cfg['oauth_consumer_'+key] = input[key];
			}
			cfg.save();
			auth((err,d)=>{if (err) throw err;});
		});
	} else {
		auth((err,d)=>{if (err) throw err;});
	}
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

		cfg.user_id = results2.user_id;
		cfg.screen_name = results2.screen_name;
		cfg.oauth_access_token_key = oauth_access_token;
		cfg.oauth_access_token_secret = oauth_access_token_secret;
		cfg.save();

		callback(null, {
			consumer_key: cfg.oauth_consumer_key,
			consumer_secret: cfg.oauth_consumer_secret,
			access_token_key: cfg.oauth_access_token_key,
			access_token_secret: cfg.oauth_access_token_secret
		});
	}
}
