module.exports = new function () {
	return function () {
		require('browser-sync')({
			notify: false,
			directory: true,
			open: false,
			port: cfg.serverPort,
			server: {
				baseDir: cfg.dest.root,
				middleware: [
					require('connect-modrewrite')([
						'^/package\.json$ /root/package.json',
						'^/bower\.json$ /root/bower.json'
					])
				],
				routes: {
					'/root': './',
					'/pics': cfg.src.tempImg,
					'/src': cfg.src.root,
					'/scripts': cfg.src.scripts,
					'/modules': cfg.src.modules,
					'/layouts': cfg.src.layouts,
					'/bower_components': cfg.src.bowerComponents,
					'/node_modules': cfg.src.nodeModules
				}
			}
		});
	};
};