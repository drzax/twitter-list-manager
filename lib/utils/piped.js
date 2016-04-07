module.exports = function (cb) {

	var content = '';

	process.stdin.setEncoding('utf8');

	if (process.stdin.isTTY) {
		return cb(content);
	}

	process.stdin.on('readable', ()=>{
		var chunk = process.stdin.read();
		content += (chunk) ? chunk : '';
	});

	process.stdin.on('end', () => {
		cb(content);
	});
};