// Exports
module.exports.builder = builder;
module.exports.handler = handler;

const docs = "https://dev.twitter.com/rest/reference/";

// Dependencies
var Twitter = require('twitter');
var cfg = require('./config');
var omit = require('lodash.omit');
var ends = require('./endpoints');
var colours = require('colors');
var open = require('open');

// Setup twitter client
var client = new Twitter({
	consumer_key: cfg.oauth_consumer_key,
	consumer_secret: cfg.oauth_consumer_secret,
	access_token_key: cfg.oauth_access_token_key,
	access_token_secret: cfg.oauth_access_token_secret
});

function builder (yargs) {
	yargs
		.usage('\nUsage: tw raw <endpoint> [params]\n\nWhere <endpoint> is one of:\n' + ends.map(function(d){return d[1];}).join(', ') + '\n')
		.describe('pretty', 'Pretty print the output')
		.describe('docs', 'Open the documentation page for the given endpoint')
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
		console.error("\nInvalid endpoint".red);
		throw "";
	}

	if (yargs.docs) {
		open(docs + end.map((d)=> d.toLowerCase()).join('/'));
	}

	method = end[0].toLowerCase();

	yargs.endpoint = end[1].replace(/:[a-z]*/g, function(match){
		match = match.substr(1);
		var replacement = args[match];
		delete args[match];
		return replacement;
	});

	// Check the requisite list exists
	client[method](yargs.endpoint, args, handleResult);

	function handleResult(err, response) {

		console.log(JSON.stringify(response, null, (yargs.pretty) ? 2 : null));

		if (err) {
			throw err;
		}
	}
}