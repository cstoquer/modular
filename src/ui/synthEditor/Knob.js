var constants    = require('./constants');
var domUtils     = require('../domUtils');
var map          = require('../../core/utils').map;
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var removeDom    = domUtils.removeDom;
var GRID_SIZE    = constants.GRID_SIZE;
var PI2          = Math.PI * 2;
var MIN          = -Math.PI - 1;
var MAX          =  1;
var AMP          = 68;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Knob(parent) {
	this.dom    = createDiv('synthEdit-knob', parent.dom);
	this.canvas = createDom('canvas', 'synthEdit-knob-canvas', this.dom);
	this.ctx    = this.canvas.getContext('2d');
	this._color = constants.getColor(0);
	this.value  = 0;

	this._initCanvasContext();
	this._initMouseEvents();
	this.updateValue();
}
module.exports = Knob;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype._initCanvasContext = function () {
	this.canvas.width  = 32;
	this.canvas.height = 32;
	var ctx = this.ctx;
	ctx.lineCap     = 'butt';
	ctx.lineWidth   = 8;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype._initMouseEvents = function () {
	var t = this;
	this.dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;
		var startV = t.value;
		// t.valueDiplay.style.display = '';


		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(-AMP, Math.min(AMP, startV + startY - e.clientY));
			// t._mark.style.transform = 'rotate(' + (delta * 2) + 'deg)';
			t.value = delta;
			// TODO: add an option to not updating value in real time
			t.updateValue();
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			// t.valueDiplay.style.display = 'none';
			t.updateValue();
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.position = function (x, y) {
	this.dom.style.left  = x * GRID_SIZE + 'px';
	this.dom.style.top   = y * GRID_SIZE + 'px';
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.color = function (color) {
	this._color = constants.getColor(color);
	this.updateValue();
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.setValue = function (value) {
	this.value = value;
	this.updateValue();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* value between 0 and 1 */
Knob.prototype.updateValue = function () {
	var ctx = this.ctx;
	ctx.clearRect(0, 0, 32, 32);

	ctx.strokeStyle = this._color.low;
	ctx.beginPath();
	ctx.arc(16, 16, 11, 0, PI2);
	ctx.stroke();

	ctx.strokeStyle = this._color.hi;
	ctx.beginPath();
	ctx.arc(16, 16, 11, MIN, map(this.value, -AMP, AMP, MIN, MAX));
	ctx.stroke();

	return this;
};
