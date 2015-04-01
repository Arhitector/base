module.exports = new function () {
	// base path 
	this.src = {};
	this.src.root			= './src';
	this.src.styles			= this.src.root + '/styles';
	this.src.browserSupport	= 'last 2 versions';
	this.src.allCss			= 'all.min.css';
	this.src.js				= this.src.root + '/scripts';
	this.src.img			= this.src.root + '/images';
	this.src.sprites		= this.src.img + '/sprites';
	this.src.tempImg		= this.src.img + '/temp';
	this.src.markups		= this.src.root + '/markups';
	this.src.fonts			= this.src.root + '/fonts';
	this.lib				= {};
	this.lib.root			= 'src';
	this.lib.root.css		= this.lib.root + '/css/libraries';
	this.lib.root			= this.lib.root + '/js';
	// base less img path 
	this.srcLess			= {}
	this.srcLess.img		= 'images';
	this.srcLess.imgTemp	= this.srcLess.img + '/temp';
	this.srcLess.imgSprites	= this.srcLess.img + '/sprites';
	// developer destanation path
	this.dest				= {};
	this.dest.cPort			= 8050;
	this.dest.root			= './www';
	this.dest.css			= this.dest.root + '/css';
	this.dest.js			= this.dest.root + '/js';
	this.dest.jsFile		= 'all.min.js',
	this.dest.img			= this.dest.root + '/img';
	// developer  destination path relative to the root directory
	this.destPath			= {};
	this.destPath.css		= 'css';
	this.destPath.js		= 'js';
	this.destPath.img		= 'img';
	this.destPath.imgTemp	= this.destPath.img;
	this.destPath.imgSprites= this.destPath.img;
}