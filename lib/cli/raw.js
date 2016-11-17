// Exports
module.exports.command = 'raw [endpoint] [options]';
module.exports.describe = 'Get the raw output from a Twitter API endpoint';
module.exports.builder = builder;
module.exports.handler = handler;

const docs = "https://dev.twitter.com/rest/reference/";
const raw = require('../raw');

// Dependencies
const omit = require('lodash.omit');
const ends = require('../endpoints');
const colours = require('colors');
const open = require('open');

function builder (yargs) {
	yargs
		.usage('\nUsage: tw raw [endpoint] [options]\n\nWhere [endpoint] is one of:\n' + ends.map(function(d){return d[1];}).join(', ') + '\n')
		.describe('pretty', 'Pretty print the output')
		.describe('docs', 'Open the documentation page for the given endpoint')
		.describe('list', 'Show a list of available endpoints')
		.alias('p','pretty')
		.boolean('pretty');

	return yargs;
}

function handler (yargs) {

	var args, end, method;

	args = omit(yargs, ['_','$0','endpoint','help','h','pretty','p','docs']);
	end = ends.find(function(e){
		return e[1] === yargs.endpoint;
	});

	if (!end) {

		if (yargs.docs) {
			open(docs.replace('reference', 'public'));
			return;
		}
		
		if (!yargs.list) {
			console.error("\nMust supply a valid endpoint".red);
			process.exitCode(1);
		}
		
		console.log("\nAvailable endpoints:\n\n\t" + ends.map(function(d){return d[1];}).join('\n\t') + '\n');
		
		return;
		
	}

	if (yargs.docs) {
		open(docs + end.map((d)=> d.toLowerCase()).join('/'));
		return;
	}

	method = end[0].toLowerCase();

	yargs.endpoint = end[1].replace(/:[a-z]*/g, function(match){
		match = match.substr(1);
		var replacement = args[match];
		delete args[match];
		return replacement;
	});

	raw(method, yargs.endpoint, args).then((res) => {
		console.log(JSON.stringify(res, null, (yargs.pretty) ? 2 : null));
	}, (err) => {
		throw err;
	});
	
}