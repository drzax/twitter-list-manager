// Exports
module.exports.command = 'correspondents';
module.exports.describe = 'List the accounts you\'ve corresponded with in the past week.';
module.exports.builder = builder;
module.exports.handler = handler;

const correspondents = require('../correspondents');

function builder (yargs) {
	yargs
		.usage('\nUsage: tw correspondents')
		.describe('duration', 'How far back to look for correspondents')
		.default('duration', '1-week')
		.alias('duration', 'd');

	return yargs;
}

function handler (yargs) {
	correspondents(yargs.duration)
		.then((users) => users.forEach((name)=>console.log(name)), (err) => console.log(err));
}
