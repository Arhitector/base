module.exports = new function () {
	cfg.imagesMin = true;
	cfg.minifiedCssFilename = 'all.min.css';
	// encode image to base64
	cfg.base64Enable	= false;
	cfg.base64Size		= 8*1024;
	// browser support for autoprefixer
	cfg.autoprefixerBrowserSupport	= "> 1%";
	// less variables overrides
	cfg.lessOverrides = {
		root: '..',
		get img() {
			return this.root + '/img';
		},
		get fonts() {
			return this.root + '/fonts';
		},
		get imgModules() {
			return this.img;
		},
		get imgTemp() {
			return this.img;
		},
		get imgSprites() {
			return this.root + '/img';
		}
	};
};
