#! /usr/bin/env node

var argv = require('yargs')
	.usage('\nUsage: tw <command>')
	.command('auth', 'Authorise with Twitter', require('./lib/auth'))
	.command('list-add <list> [accounts]', 'Add users to a list', require('./lib/list-add'))
	.command('list-remove <list> [accounts]', 'Remove users from a list', require('./lib/list-remove'))
	.demand(1, '')
	.help('h')
	.alias('h', 'help')
	.argv;
