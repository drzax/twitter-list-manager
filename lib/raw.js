module.exports = raw;

const client = require('./utils/client');

function raw(method, endpoint, args) {
	return new Promise((resolve, reject) => {
		client[method](yargs.endpoint, args, (err, res) => {
			reject(err);
			resolve(res);
		});
	});
}