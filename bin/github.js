const fs = require('fs-extra');
const Utils = require('./utils');
const path = require('path');

const LOG_PATH = `${process.env.GITHUB_ACTION_PATH}/logs`;
const ACTIONS_PATH = `${process.env.GITHUB_ACTION_PATH}/actions`;

const setConfiguration = (key, value) => {
	console.log(`Setting output for ${key}.`);
	console.log(`::set-output name=${key}::${value}`);
};

/**
 * Outputs the location for the screenshots in the ui-check
 */
const setUIScreenshotPath = () => {
	setConfiguration(
		'location',
		`${process.env.GITHUB_ACTION_PATH}/actions/ui-check/screenshots`
	);
};

/**
 * Outputs the location for the logs
 */
const setLogPath = () => {
	setConfiguration('logs', LOG_PATH);
};

(() => {
	console.log('Setting configurations');
	setUIScreenshotPath();
	setLogPath();
	Utils.createLogs(ACTIONS_PATH, LOG_PATH, true);
})();
