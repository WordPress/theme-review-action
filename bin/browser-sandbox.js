const path = require('path');
const net = require('net');
const execa = require('execa');

/**
 * Name of the disposable container that runs the rendering browser.
 *
 * @type {string}
 */
const CONTAINER_NAME = 'theme-review-browser';

/**
 * Pinned browser image. Keep its version matched to the @playwright/test
 * dependency in actions/ui-check so the host and the container agree.
 *
 * @type {string}
 */
const BROWSER_IMAGE = 'mcr.microsoft.com/playwright:v1.62.1-noble';

/**
 * Loopback port the browser server listens on and the host connects to.
 *
 * @type {number}
 */
const CDP_PORT = 9222;

/**
 * Absolute path to the launcher mounted read-only into the container.
 *
 * @type {string}
 */
const LAUNCHER_FILE = path.join(
	__dirname,
	'../actions/ui-check/docker/launch-browser.cjs'
);

/**
 * The image ships browsers but not the playwright module, so the launcher
 * resolves playwright-core from the action's mounted (read-only) node_modules.
 *
 * @type {string}
 */
const NODE_MODULES_DIR = path.join(
	__dirname,
	'../actions/ui-check/node_modules'
);

/**
 * Polls the browser server's port until it accepts a connection or times out.
 *
 * @param {number} timeoutMs Maximum time to wait, in milliseconds.
 * @return {Promise<void>} Resolves once the port is reachable.
 */
const waitForBrowser = (timeoutMs) => {
	const deadline = Date.now() + timeoutMs;

	return new Promise((resolve, reject) => {
		const attempt = () => {
			const socket = net.connect(CDP_PORT, '127.0.0.1');
			socket.once('connect', () => {
				socket.destroy();
				resolve();
			});
			socket.once('error', () => {
				socket.destroy();
				retry();
			});
		};

		const retry = () => {
			if (Date.now() > deadline) {
				reject(
					new Error('Timed out waiting for the rendering browser.')
				);
				return;
			}
			setTimeout(attempt, 250);
		};

		attempt();
	});
};

/**
 * Starts the disposable, hardened container that renders submitted themes.
 *
 * The container mounts none of the runner's paths, so a renderer compromise
 * cannot reach GITHUB_ENV, the runner command files, or the action's code.
 *
 * @return {Promise<object>} Environment pointing the UI check at the browser.
 */
const startBrowserSandbox = async () => {
	await removeBrowserSandbox();

	// Array form so paths containing spaces stay intact as single arguments.
	await execa('docker', [
		'run',
		'--detach',
		'--rm',
		'--name',
		CONTAINER_NAME,
		'--network',
		'host',
		'--cap-drop',
		'ALL',
		'--security-opt',
		'no-new-privileges',
		'--env',
		`CDP_PORT=${CDP_PORT}`,
		'--volume',
		`${LAUNCHER_FILE}:/launch-browser.cjs:ro`,
		'--volume',
		`${NODE_MODULES_DIR}:/node_modules:ro`,
		BROWSER_IMAGE,
		'node',
		'/launch-browser.cjs',
	]);

	await waitForBrowser(60000);

	return {
		PLAYWRIGHT_WS_ENDPOINT: `ws://127.0.0.1:${CDP_PORT}/ws`,
	};
};

/**
 * Stops the browser container, letting the launcher close the server cleanly.
 * The container was started with --rm, so stopping it also removes it.
 *
 * @return {Promise<void>} Resolves once the container has stopped.
 */
const stopBrowserSandbox = async () => {
	try {
		await execa('docker', ['stop', CONTAINER_NAME]);
	} catch (e) {
		/* Not running. */
	}
};

/**
 * Force-removes any leftover container from an earlier run so the name is free.
 *
 * @return {Promise<void>} Resolves once any stale container is gone.
 */
const removeBrowserSandbox = async () => {
	try {
		await execa('docker', ['rm', '--force', CONTAINER_NAME]);
	} catch (e) {
		/* Nothing to remove. */
	}
};

module.exports = { startBrowserSandbox, stopBrowserSandbox };
