module.exports = add;

const client = require('./utils/client');
const cfg = require('./config');

function add(list, accounts) {
	return new Promise((resolve, reject) => {
		var length = accounts.length;
		var delay = 500;
		var params = {};
		
		params.screen_name = accounts.splice(0,100).join(',');
		
		if (isNumeric(list)) {
			params.list_id = list;
		} else {
			params.slug = list;
			params.owner_screen_name = cfg.screen_name;
		}

		client.post('lists/members/create_all', params, handleResult);

		function handleResult(err, res) {
			
			if (err) {
				reject(err);
			}
			
			if (accounts.length) {
				delay = delay*2;
				params.screen_name = accounts.splice(0,100).join(',');
				setTimeout(()=>client.post('lists/members/create_all', params, handleResult), delay);
			} else {
				resolve({
					count: length,
					list: list
				});
			}
		}
	});
}

function isNumeric(n) {
	return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}