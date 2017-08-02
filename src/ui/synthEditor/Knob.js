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
	this.editor      = parent; // TODO: should we allow parent to be any else than editor?
	this.dom         = createDiv('synthEdit-knob', parent.dom);
	this.canvas      = createDom('canvas', 'synthEdit-knob-canvas', this.dom);
	this.ctx         = this.canvas.getContext('2d');
	this._color      = constants.getColor(0);
	this.value       = 0;
	this.min         = 0;
	this.max         = 0;
	this._obj        = null;
	this._attribute  = null;
	this._autoUpdate = false;
	this._integer    = false;

	this._initCanvasContext();
	this._initMouseEvents();
	this._updateDisplay();
}
module.exports = Knob;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.bind = function (obj, attribute, min, max) {
	this.min = min;
	this.max = max;
	this._obj = obj;
	this._attribute = attribute;

	this.value = map(obj[attribute], min, max, -VALUE_AMP, VALUE_AMP);
	this._updateDisplay();
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.autoUpdate = function () {
	this._autoUpdate = true;
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.setAsInt = function () {
	this._integer = true;
	return this;
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
	this._updateDisplay();
	return this;
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
	var self = this;
	this.dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;
		var startV = self.value;
		// self.valueDiplay.style.display = '';


		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(-VALUE_AMP, Math.min(VALUE_AMP, startV + startY - e.clientY));
			// TODO: add an option to not updating value in real time
			self._setValue(delta);
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			// self.valueDiplay.style.display = 'none';
			// self._updateDisplay();
			if (self._autoUpdate && self._obj) {
				self.editor.updateBuffer();
			}
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype._setValue = function (value) {
	this.value = value;
	this._updateDisplay();

	// send value
	if (!this._obj) return;
	var value = map(this.value, -VALUE_AMP, VALUE_AMP, this.min, this.max);
	if (this._integer) value = Math.round(value);
	this._obj[this._attribute] = value;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* value between 0 and 1 */
Knob.prototype._updateDisplay = function () {
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
