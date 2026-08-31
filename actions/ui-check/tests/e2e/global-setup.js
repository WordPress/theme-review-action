const fs = require('fs');
const path = require('path');

/**
 * Creates the output directories the specs write into before the run.
 *
 * Paths mirror tests/utils/paths.js; kept literal here to avoid loading the
 * ESM utils from the CommonJS config loader.
 *
 * @return {Promise<void>} Resolves once the directories exist.
 */
module.exports = async () => {
	const dirs = ['output', 'output/html', 'output/screenshots'];

	for (const dir of dirs) {
		fs.mkdirSync(path.resolve(dir), { recursive: true });
	}
};
