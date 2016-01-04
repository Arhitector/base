module.exports = new function () {
	// source
	cfg.src = {
		root: 'src',
		nodeModules: './node_modules',
		bowerComponents: './bower_components',
		get img() {
			return this.root + '/images';
		},
		get media() {
			return this.img + '/media';
		},
		get sprites() {
			return this.img + '/sprites';
		},
		get tempImg() {
			return this.img + '/temp';
		},
		get dataUri() {
			return this.img + '/dataUri';
		},
		get styles() {
			return this.root + '/styles/';
		},
		get scripts() {
			return this.root + '/scripts';
		},
		get fonts() {
			return this.root + '/fonts';
		},
		get vendor() {
			return this.root + '/vendor';
		},
		get markups() {
			return this.root + '/markups';
		},
		get layouts() {
			return this.markups + '/layouts';
		},
		get modules() {
			return this.markups + '/modules';
		},
		get blocks() {
			return this.markups + '/blocks';
		}
	};
	// destination
	cfg.dest = {
		root: 'www',
		get html() {
			return this.root + '/';
		},
		get img() {
			return this.root + '/img';
		},
		get css() {
			return this.root + '/css';
		},
		get js() {
			return this.root + '/js';
		},
		get fonts() {
			return this.root + '/fonts';
		},
		get temp() {
			return this.root + '/temp';
		},
		get	dist() {
			return this.root + '/temp/dist';
		}
	};
};