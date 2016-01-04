module.exports = new function () {
	cfg.minifiedJsFilename	= 'all.min.js';
	cfg.jsBundle = 'all';
	cfg.jsBundles = {
		all: {
			main: [
				'scripts/app'
			],
			include: [
				'*'
			],
			exclude: []
		}
	};
};
