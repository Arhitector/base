module.exports = new function () {
	// base path
	this.cPort				= 8050; // port server http://localhost:8050
	this.base64Enable		= true; // Is it need to use base64 convert image in css
	this.SystemNotify		= false; // is it need to notify about successful compilation
	// developer destanation path
	this.dest				= {};
	this.dest.root			= './prod';
	this.dest.css			= this.dest.root + '/css';
	this.dest.js			= this.dest.root + '/js';
	this.dest.jsFile		= 'all.min.js',
	this.dest.img			= this.dest.root + '/img';
	// Less variables
	this.destLess			= {};
	this.destLess.img		= '"../img"';
	this.destLess.imgTemp	= this.destLess.img;
	this.destLess.imgSprites= this.destLess.img;
	// Jade variables
	this.destJade			= {};
	this.destJade.title		= 'Omnigon';
	this.destJade.css		= 'css';
	this.destJade.js		= 'js';
	this.destJade.img		= 'img';
	this.destJade.imgTemp	= this.destJade.img;
	this.destJade.imgSprites= this.destJade.img;
}