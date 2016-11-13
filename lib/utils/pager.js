// Pages through Twitter API calls until criteria met
module.exports = pager;

var decrement = require('./decrement');

function pager(transport, endpoint, args, callback, stop) {

	var response = [];
	
	stop = stop || function () {return false;};

	transport.get(endpoint, args, handleResult);

	function handleResult(err, res) {
		if (err) return callback(err);
		response = response.concat(res);
		if (res.next_cursor === 0 || stop(res)) {
			callback(null, response);
		} else {
			if (res.next_cursor_str) {
				args.cursor = res.next_cursor_str;
			} else {
				args.max_id = decrement(response[response.length-1].id_str);
			}
			transport.get(endpoint, args, handleResult);
		}
	}
}

