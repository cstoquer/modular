var constants    = require('./constants');
var domUtils     = require('../domUtils');
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var removeDom    = domUtils.removeDom;
var GRID_SIZE    = constants.GRID_SIZE;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Container(parent) {
	this.dom = createDiv('synthEdit-container', parent.dom);
}
module.exports = Container;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** set size in unit (grid based) */
Container.prototype.rect = function(x, y, w, h) {
	this.dom.style.left   = x * GRID_SIZE + 'px';
	this.dom.style.top    = y * GRID_SIZE + 'px';
	this.dom.style.width  = w * GRID_SIZE - 20 + 'px';
	this.dom.style.height = h * GRID_SIZE - 20 + 'px';
	return this;
};