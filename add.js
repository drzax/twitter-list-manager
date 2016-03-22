// Exports
module.exports.builder = builder;
module.exports.handler = handler;

// Dependencies
var Twitter = require('twitter');
var cfg = require('home-config').load('.tlmrc');

function builder (yargs) {
	yargs
		.usage('\nUsage: add <list> [options]')
		.describe('list', 'The Twitter list to add user to')
		.string('list')
		.demand('accounts', 'A comma separated list of accounts to add to the list');

	return yargs;
}

function handler (yargs) {

	var client = new Twitter({
		consumer_key: cfg.oauth_consumer_key,
		consumer_secret: cfg.oauth_consumer_secret,
		access_token_key: cfg.oauth_access_token_key,
		access_token_secret: cfg.oauth_access_token_secret
	});

	client.get('lists/ownerships', {count: 1000}, handleLists);

	function handleLists(err, response) {
		var list = response.lists.find(function(d) {return d.slug === yargs.list;});
		console.log(list);
	}
}