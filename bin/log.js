/* eslint-disable no-console */
/**
 * External dependencies
 */
const chalk = require('chalk');

const code = (input) => {
	console.log(chalk.cyan(input));
};

const error = (input) => {
	console.log(chalk.bold.red(input));
};

const warning = (input) => {
	console.log(chalk.bold.yellow(input));
};

const info = (key, value) => {
	const color = chalk.bold.blue(key);

	if (value) {
		console.log(color, value);
	} else {
		console.log(color);
	}
};

const print = (input) => console.log(input);

const success = (input) => {
	console.log(chalk.bold.green(input));
};

module.exports = {
	code,
	error,
	info,
    success,
    warning,
	print,
};
/* eslint-enable no-console */
