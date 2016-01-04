define(['swiper', 'can', 'can/control/', 'can/construct/super/super'], function (swiper, can, Control, _super) {
	// private classes and functions
	var ExampleSlider = Control.extend({
			defaults: {
				sliderOptions: {
					slidesPerView: 2,
					pagination: '.swiper-pagination',
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
					paginationClickable: true
				}
			}
		},
		{
			init: function (el, opts) {
				this._super();
				this.render();
			},

			render: function () {
				this.slider = new Swiper('#' + this.element.attr('id') + ' .swiper-container', this.options.sliderOptions);
			}
		});

	return function (id, opts) {
		return new ExampleSlider(id, opts);
	};
});
