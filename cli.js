#! /usr/bin/env node

var argv = require('yargs')
	.usage('\nUsage: tw <command>')
	.command(require('./lib/cli/auth'))
	.command(require('./lib/cli/list-add'))
	.command(require('./lib/cli/list-remove'))
	.command(require('./lib/cli/list-members'))
	.command(require('./lib/cli/correspondents'))
	.command(require('./lib/cli/raw'))
	.demand(1, '')
	.help('h')
	.alias('h', 'help')
	.argv;
