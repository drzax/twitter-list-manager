// Exports
module.exports.builder = builder;
module.exports.handler = handler;

// Dependencies
var Twitter = require('twitter');
var cfg = require('./config');

// Setup twitter client
var client = new Twitter({
	consumer_key: cfg.oauth_consumer_key,
	consumer_secret: cfg.oauth_consumer_secret,
	access_token_key: cfg.oauth_access_token_key,
	access_token_secret: cfg.oauth_access_token_secret
});

function builder (yargs) {
	yargs
		.usage('\nUsage: tw list-add <list> [accounts]')
		.describe('list', 'The Twitter list to add users to')
		.string('list')
		.describe('accounts', 'A comma separated list of accounts to add to the list')
		.string('accounts')
		.describe('create', 'Create the list if it doesn\'t exist')
		.alias('c', 'create')
		.boolean('create');

	return yargs;
}

function handler (yargs) {

	var accounts;

	if (yargs.accounts) {
		accounts = yargs.accounts.split(',');
	}

	// TODO: Accept file input
	// if (yargs.file)

	// Check the requisite list exists
	client.get('lists/ownerships', {count: 1000}, handleLists);

	function handleLists(err, response) {

		var list;

		if (err) {
			// TODO: handle bad auth specifically so it's clear what the problem is.
			throw err;
		}

		list = response.lists.find(function(d) {return d.slug === yargs.list;});

		if (!list) {
			// TODO: create the missing list (maybe make this a flag)
			console.error(`\nList '${yargs.list}' doesn't exist.\nAvailable lists:\n\n` + response.lists.map(function(d) {
				return '  '+d.slug;
			}).join('\n'));
			process.exit(1);
		}

		client.post('lists/members/create_all', {list_id: list.id_str, screen_name: accounts.join(',')}, function(err, res){
			if (err) {
				throw err;
			}
			console.log(`\nThe following users were added to the '${yargs.list}' list:\n` + accounts.join(', '));
		});

	}
}

function flatten (a, b) {
  return a.concat(b);
}