module.exports = members;

const client = require('./utils/client');
const pager = require('./utils/pager');
const cfg = require('./config');

function members(list, user) {
	return new Promise((resolve, reject) => {
		
		var users, members;

		users = [];
		
		members = pager(client, 'lists/members', {
			count: 5000, 
			slug: list, 
			owner_screen_name: user || cfg.screen_name
		});
		
		members.then((members) => {
			resolve(members.map(member => member.screen_name));
		});
	});
}
