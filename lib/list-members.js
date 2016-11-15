module.exports = members;

const client = require('./utils/client');
const pager = require('./utils/pager');
const cfg = require('./config');
const kgo = require('kgo');

function members(list, user) {
	return new Promise((resolve, reject) => {
		
		// tw raw lists/members --slug=cycle --owner_screen_name=drzax
		
		var users;

		users = [];
		
		kgo
		('members', (done) => {
			pager(
				client,
				'lists/members',
				{count: 5000, slug: list, owner_screen_name: user || cfg.screen_name},
				compile(done)
			);
		})
		('final', ['members'], (members, done) => {
			resolve(members);
		})
		(['*'], (err) => reject(err));

		function compile (done) {
			return function (err, res) {
				if (err) return done(err);
				done(null, res.reduce((all, res) => {
					return all.concat(res.users);
				},[]).map(member => member.screen_name));
			};
		}
	});
}
