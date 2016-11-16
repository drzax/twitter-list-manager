// Exports
module.exports.command = 'list-members <list>';
module.exports.describe = 'List the members of a list';
module.exports.builder = builder;
module.exports.handler = handler;

const members = require('../list-members');

function builder (yargs) {
	yargs
		.usage('\nUsage: tw list-members <list>')
		.describe('user', 'The user who owns the list (defaults to authenticated user)');
	return yargs;
}

function handler (yargs) {
	members(yargs.list, yargs.user)
		.then((users) => users.forEach((name)=>console.log(name)))
		.catch((err) => console.log(err));
}
