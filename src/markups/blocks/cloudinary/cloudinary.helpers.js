module.exports = new function () {
	return {
		cloudinary: function (src, options) {
			if (!options) {
				options = src;
				src = '';
			}

			var Handlebars = require('handlebars'),
				classNames = src ? ['cloudinary-image'] : [],
				attributes = options.hash.attributes,
				placeholder = options.hash.placeholder || Handlebars.getPropertyValue('defaultPlaceholder', options.data);

			if (attributes) {
				try {
					attributes = JSON.parse(attributes);
				}
				catch (e) {
					console.log(e);
				}
			}
			else {
				attributes = {};
			}
			if (options.hash.classNames) {
				try {
					var additionalClassNames = JSON.parse(options.hash.classNames);

					additionalClassNames.forEach(function (className) {
						classNames.push(className);
					});
				}
				catch (e) {
					console.log(e);
				}
			}
			return Handlebars.compile('{{>cloudinary}}', {
				noEscape: true
			})({
				'src': src,
				'classNames': classNames,
				'placeholder': placeholder,
				'attrs': attributes
			});
		}
	};
};