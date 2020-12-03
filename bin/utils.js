
// Thanks: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
const fancyTimeFormat = (duration) => {
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = '';

	if (hrs > 0) {
		ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
	}

	ret += '' + mins + ':' + (secs < 10 ? '0' : '');
	ret += '' + secs;
	return ret;
};

module.exports = {
    fancyTimeFormat
}
