module.exports = {
	exitOnPageError: false,
	launch: {
		headless: process.env.PUPPETEER_HEADLESS !== 'false',
		defaultViewport: {
			width: 1280,
			height: 800,
		},
	},
};
