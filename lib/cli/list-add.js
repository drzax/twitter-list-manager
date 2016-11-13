// Exports
module.exports.command = 'list-add <list> [accounts]';
module.exports.describe = 'Add users to a list';
module.exports.builder = builder;
module.exports.handler = handler;

// Dependencies
const add = require('../list-add');
const piped = require('../utils/piped');
const client = require('../utils/client');
const normalise = require('../utils/normalise-input');

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

	var accounts, group;

	piped((content)=>{

		accounts = normalise(yargs.accounts || '').concat(normalise(content));

		// Check the requisite list exists
		client.get('lists/ownerships', {count: 1000}, handleLists);
	});

	function handleLists(err, response) {

		var list;

		if (err) {
			// TODO: handle bad auth specifically so it's clear what the problem is.
			throw err;
		}

		list = response.lists.find(function(d) {return d.slug === yargs.list;});

		if (!list) {
			if (yargs.create) {
				client.post('lists/create', {name: yargs.list, mode: 'private'}, (err, res) => {
					// console.log(err, res);
					if (err) throw err;
					add(res.id_str, accounts, res.slug).then(outcome);
				});
			} else {
				console.error(`\nList '${yargs.list}' doesn't exist.\nAvailable lists:\n\n` + response.lists.map((d) => {
					return '  '+d.slug;
				}).join('\n'));
				process.exit(1);
			}
		} else {
			add(list.id_str, accounts, yargs.list).then(outcome);
		}
	}
}

function outcome(metadata) {
	console.log(`\n${metadata.count} users were added to the '${metadata.list}' list.`);
}