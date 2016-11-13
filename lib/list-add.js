module.exports = add;

const client = require('./utils/client');

function add(list_id, accounts, list_slug) {
	return new Promise((resolve, reject) => {
		var length = accounts.length;
		var delay = 500;

		client.post('lists/members/create_all', {list_id: list_id, screen_name: accounts.splice(0,100).join(',')}, handleResult);

		function handleResult(err, res) {
			
			if (err) {
				reject(err);
			}
			
			if (accounts.length) {
				delay = delay*2;
				setTimeout(()=>client.post('lists/members/create_all', {list_id: list_id, screen_name: accounts.splice(0,100).join(',')}, handleResult), delay);
			} else {
				resolve({
					count: length,
					list: list_slug
				});
			}
		}
	});
}