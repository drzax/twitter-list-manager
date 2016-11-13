// Exports
module.exports.command = 'list-remove <list> [accounts]';
module.exports.describe = 'Remove users from a list';
module.exports.builder = builder;
module.exports.handler = handler;

// Dependencies
const remove = require('../list-remove');
const client = require('../utils/client');
const piped = require('../utils/piped');
const normalise = require('../utils/normalise-input');

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

	piped((content)=>{
		accounts = normalise(yargs.accounts || '').concat(normalise(content));
		remove(yargs.list, accounts)
		.then((metadata) => {
			console.log(`\nThe following users were removed from the '${metadata.list}' list:\n` + metadata.accounts.join(', '));
		})
		.catch((err) => {
			if (err[0].code === 34) return missingList(yargs.list);
			else throw err;
		});
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
