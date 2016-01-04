define(['scripts/config', 'jquery', 'can/construct/', 'scripts/device', 'cloudinary'], function (config, $, Construct, device, cloudinary) {
	window.app = new Construct.extend({
		'device': device,

		init: function () {
			this.addHtmlClasses();
			this.initCloudinary();
		},

		addHtmlClasses: function () {
			var document = $('html');

			if (device.isMobile) {
				document.addClass('mobile');
			}
			if (device.isTouch) {
				document.addClass('touch');
			}
		},

		initCloudinary: function () {
			if (config.cloudinary) {
				$.cloudinary.config(config.cloudinary);
				$('.cloudinary-image').each(function () {
					var $img = $(this),
						imgConfig = {},
						width = parseInt($img.css('max-width')),
						height = parseInt($img.css('max-height'));

					if (!isNaN(width)) {
						imgConfig.width = width;
					}
					if (!isNaN(height)) {
						imgConfig.height = height;
					}
					$img.cloudinary(imgConfig);
				});
			}
		}
	});

	return window.app;
});


