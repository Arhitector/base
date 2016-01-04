module.exports = new function () {
	var fs = require('fs');

	return {
		load: function (env) {
			if (!env || typeof env !== 'string') {
				throw new Error('Wrong environment argument');
			}
			if (!fs.existsSync('config/' + env + '.js')) {
				throw new Error('Environment "' + env + '" is not exists');
			}
			global.env = env;
			global.cfg = require('../config/config');
			require('../config/config-paths');
			require('../config/config-logging');
			require('../config/config-templates');
			require('../config/config-styles');
			require('../config/config-scripts');
			require('../config/' + env);
		}
	};
};