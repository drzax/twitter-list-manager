module.exports = raw;

const client = require('./utils/client');

function raw(method, endpoint, args) {
	return new Promise((resolve, reject) => {
		client[method](endpoint, args, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
}