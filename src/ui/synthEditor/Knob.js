var constants    = require('./constants');
var domUtils     = require('../domUtils');
var map          = require('../../core/utils').map;
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var removeDom    = domUtils.removeDom;
var GRID_SIZE    = constants.GRID_SIZE;
var PI2          = Math.PI * 2;  // to draw the full circle
var DISPLAY_MIN  = -Math.PI - 1; // begining of arc angle
var DISPLAY_MAX  =  1;           // maximum  of arc angle
var VALUE_AMP    = 68; // amplitude of internal value (how much the mouse has to move)

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Knob(parent) {
	this.dom        = createDiv('synthEdit-knob', parent.dom);
	this.canvas     = createDom('canvas', 'synthEdit-knob-canvas', this.dom);
	this.ctx        = this.canvas.getContext('2d');
	this._color     = constants.getColor(0);
	this.value      = 0;
	this.min        = 0;
	this.max        = 0;
	this._obj       = null;
	this._attribute = null;

	this._initCanvasContext();
	this._initMouseEvents();
	this.updateDisplay();
}
module.exports = Knob;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.bind = function (obj, attribute, min, max) {
	this.min = min;
	this.max = max;
	this._obj = obj;
	this._attribute = attribute;

	this.value = map(obj[attribute], min, max, -VALUE_AMP, VALUE_AMP);
	this.updateDisplay();
};

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
			var delta = Math.max(-VALUE_AMP, Math.min(VALUE_AMP, startV + startY - e.clientY));
			// TODO: add an option to not updating value in real time
			t.setValue(delta);
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			// t.valueDiplay.style.display = 'none';
			// t.updateDisplay();
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
	this.updateDisplay();
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.setValue = function (value) {
	this.value = value;
	this.updateDisplay();

	// send value
	if (!this._obj) return;
	this._obj[this._attribute] = map(this.value, -VALUE_AMP, VALUE_AMP, this.min, this.max);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* value between 0 and 1 */
Knob.prototype.updateDisplay = function () {
	var ctx = this.ctx;
	ctx.clearRect(0, 0, 32, 32);

	ctx.strokeStyle = this._color.low;
	ctx.beginPath();
	ctx.arc(16, 16, 11, 0, PI2);
	ctx.stroke();

	ctx.strokeStyle = this._color.hi;
	ctx.beginPath();
	ctx.arc(16, 16, 11, DISPLAY_MIN, map(this.value, -VALUE_AMP, VALUE_AMP, DISPLAY_MIN, DISPLAY_MAX));
	ctx.stroke();


	return this;
};
