module.exports = new function () {
	// base path 
	this.cssBuilder				= "less"; //chouse compiller : less sass
	this.cPort					= 8050; // port server http://localhost:8050
	this.base64Enable			= true; // Is it need to use base64 convert image in css
	this.SystemNotify			= true; // is it need to notify about successful compilation
	// source path and variables
	this.src					= {};
	this.src.root				= './src';
	this.src.styles				= this.src.root + '/styles/' + this.cssBuilder;
	this.src.base64Size			= 8*1024 //size img to base64 DOESN'T work
	this.src.browserSupport		= 'last 2 versions';
	this.src.allCss				= 'all.min.css';
	this.src.js					= this.src.root + '/scripts';
	this.src.img				= this.src.root + '/images';
	this.src.sprites			= this.src.img + '/sprites';
	this.src.tempImg			= this.src.img + '/temp';
	this.src.modulesImg			= this.src.modules + '/img';
	this.src.modulesImgSprite	= this.src.modules + '/sprite';
	this.src.markups			= this.src.root + '/markups';
	this.src.modules			= this.src.markups + '/modules';
	this.src.fonts				= this.src.root + '/fonts';
	this.src.lib				= this.src.root + '/library';
	// developer destanation path
	this.dest					= {};
	this.dest.root				= './www';
	this.dest.html				= this.dest.root + '/';
	this.dest.css				= this.dest.root + '/css';
	this.dest.js				= this.dest.root + '/js';
	this.dest.jsFile			= 'all.min.js',
	this.dest.img				= this.dest.root + '/img';
	// style variables
	this.destLess				= {};
	this.destLess.img			= '"../img"';
	this.destLess.modules		= this.destLess.img;
	this.destLess.imgTemp		= this.destLess.img;
	this.destLess.imgSprites	= this.destLess.img;
	// Jade variables
	this.destJade				= {};
	this.destJade.title			= 'Omnigon';
	this.destJade.css			= 'css';
	this.destJade.js			= 'js';
	this.destJade.img			= 'img';
	this.destJade.imgTemp		= this.destJade.img;
	this.destJade.imgSprites	= this.destJade.img;
}