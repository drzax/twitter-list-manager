#! /usr/bin/env node

var colors = require('colors');

var argv = require('yargs')
	.usage('\nUsage: tlm <command>')
	.command('auth', 'Authorise with Twitter', require('./auth'))
	.command('add <list> [accounts]', 'Add users to a list', require('./add'))
	.command('remove <list> [accounts]', 'Remove users from a list', require('./remove'))
	.demand(1, 'Must provide a valid command'.red)
	.help('h')
	.alias('h', 'help')
	.argv;
