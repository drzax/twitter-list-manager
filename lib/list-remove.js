module.exports = remove;

const client = require('./utils/client');
const cfg = require('./config');

function remove(list, accounts) {
	return new Promise((resolve, reject) => {
		client.post('lists/members/destroy_all', {
			slug: list,
			owner_id: cfg.user_id,
			screen_name: accounts.join(',')
		}, function(err, res){
			if (err) {
				reject(err);
			}
			resolve({
				list: list,
				accounts: accounts
			});
		});
	});
}