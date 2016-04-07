module.exports = function strDecrement(str) {
	var i, numbers = str.split('');

	if (numbers.reduce((t,d)=>+d+t,0) === 0) {
		return "-1";
	}

	// console.log(numbers);
	for (i=numbers.length;--i>=0;) {
		if (+numbers[i] === 0) {
			numbers[i] = 9;
		} else {
			numbers[i] = numbers[i]-1;
			if (i === 0 && +numbers[i] === 0) {
				numbers.shift();
			}
			break;
		}
	}
	return numbers.join('');
};