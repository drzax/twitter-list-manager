// Exports
module.exports.builder = builder;
module.exports.handler = handler;

// Dependencies
const Twitter = require('twitter');
const cfg = require('./config');
const piped = require('./utils/piped');

// Setup twitter client TODO: Use modularised client creation
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

	var accounts, group;

	piped((content)=>{

		accounts = ((yargs.accounts) ? yargs.accounts.split(',') : [])
			.concat(content.split('\n'))
			.filter((i)=>!!i)
			.reduce((t,i)=>{
				if (t.indexOf(i) === -1) {
					t.push(i);
				}
				return t;
			},[]);

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
					add(res.id_str, accounts, res.slug);
				});
			} else {
				console.error(`\nList '${yargs.list}' doesn't exist.\nAvailable lists:\n\n` + response.lists.map((d) => {
					return '  '+d.slug;
				}).join('\n'));
				process.exit(1);
			}
		} else {
			add(list.id_str, accounts, yargs.list);
		}
	}
}

function add(list_id, accounts, list_slug) {

	var length = accounts.length;
	var delay = 500;

	client.post('lists/members/create_all', {list_id: list_id, screen_name: accounts.splice(0,100).join(',')}, handleResult);

	function handleResult(err, res) {
		if (err) {
			console.log(err, accounts);
			throw err;
		}
		if (accounts.length) {
			delay = delay*2;
			setTimeout(()=>client.post('lists/members/create_all', {list_id: list_id, screen_name: accounts.splice(0,100).join(',')}, handleResult), delay);
		} else {
			console.log(`\n${length} users were added to the '${list_slug}' list.`);
		}
	}
}

function flatten (a, b) {
  return a.concat(b);
}