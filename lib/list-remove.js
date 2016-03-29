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
		.usage('\nUsage: tw list-remove <list> [accounts]')
		.describe('list', 'The Twitter list to remove users from')
		.string('list')
		.describe('accounts', 'A comma separated list of accounts to remove from the list')
		.string('accounts');

	return yargs;
}

function handler (yargs) {

	var accounts;

	if (yargs.accounts) {
		accounts = yargs.accounts.split(',');
	}

	// TODO: Accept file input
	// if (yargs.file)

	client.post('lists/members/destroy_all', {
		slug: yargs.list,
		owner_id: cfg.user_id,
		screen_name: accounts.join(',')
	}, function(err, res){
		if (err) {
			if (err[0].code === 34) return missingList(yargs.list);
			else throw err;
		}
		console.log(`\nThe following users were removed from the '${yargs.list}' list:\n` + accounts.join(', '));
	});

}


function missingList(list) {

	client.get('lists/ownerships', {count: 1000}, handleLists);

	function handleLists(err, response) {

		if (err) {
			throw err;
		}

		console.error(`\nList '${list}' doesn't exist.\nAvailable lists:\n\n` + response.lists.map(function(d) {
			return '  '+d.slug;
		}).join('\n'));

		process.exit(1);
	}

}

function flatten (a, b) {
  return a.concat(b);
}