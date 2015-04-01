module.exports = new function () {
	this.src = {};
	this.src.root		= './src';
	this.src.styles		= this.src.root + '/styles';
	this.src.allless	= this.src.styles + '/all.less';
	this.src.js			= this.src.root + '/scripts';
	this.src.img		= this.src.root + '/images';
	this.src.sprites	= this.src.img + '/sprites';
	this.src.tempImg	= this.src.img + '/temp';
	this.src.markups	= this.src.root + '/markups';
	this.src.fonts		= this.src.root + '/fonts';
	this.lib			= {};
	this.lib.root		= 'src';
	this.lib.root.css	= this.lib.root + '/css/libraries';
	this.lib.root		= this.lib.root + '/js';
	this.dest			= {};
	this.dest.cPort		= 8050;
	this.dest.root		= './prod';
	this.dest.css		= this.dest.root + '/css';
	this.dest.js		= this.dest.root + '/js';
	this.dest.jsFile	= 'all.min.js',
	this.dest.img		= this.dest.root + '/img';
}