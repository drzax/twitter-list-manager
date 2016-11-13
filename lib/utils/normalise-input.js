module.exports = function(input) {
	return input
		.split('\n')
		.join(',')
		.split(',')
		.map(i=>i.trim())
		.filter(i=>!!i)
		.reduce((t,i)=>{
			if (t.indexOf(i) === -1) {
				t.push(i);
			}
			return t;
		},[]);
};