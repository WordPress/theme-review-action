/**
 * Launches a Playwright browser server inside the disposable review container
 * and exposes its endpoint, so untrusted theme JavaScript renders here rather
 * than in the runner's own namespace.
 */
const { chromium } = require('playwright-core');

/**
 * Starts the browser server and keeps the process alive for the host to connect.
 *
 * @return {Promise<void>} Resolves when the server closes.
 */
const main = async () => {
	const port = Number(process.env.CDP_PORT) || 9222;

	const server = await chromium.launchServer({
		headless: true,
		host: '127.0.0.1',
		port,
		wsPath: 'ws',
		// Chrome's sandbox needs capabilities the container drops; its isolation replaces it.
		args: ['--no-sandbox'],
	});

	const shutdown = async () => {
		await server.close();
		process.exit(0);
	};

	process.on('SIGTERM', shutdown);
	process.on('SIGINT', shutdown);

	console.log(`browser-ready ${server.wsEndpoint()}`);
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
