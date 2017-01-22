var constants = require('./constants');
var map       = require('./utils').map;
var createDiv = require('domUtils').createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Knob
 *
 * @author Cedric Stoquer
 */
function Knob(module, id, descriptor) {
	this.value = 0;
	this.x     = descriptor.x;
	this.y     = descriptor.y;
	this.min   = descriptor.min || 0;
	this.max   = descriptor.max !== undefined ? descriptor.max : 1;
	this.int   = descriptor.int || false;

	// create dom elements
	var dom = this._dom = createDiv('knob', module._dom);
	dom.style.left = (this.x * constants.CONNECTOR_GRID_SIZE + 2) + 'px';
	dom.style.top  = (this.y * constants.CONNECTOR_GRID_SIZE + 2) + 'px';
	this._mark     = createDiv('knob knobMark', dom);
	if (descriptor.label) createDiv('label knobLabel', dom).innerText = descriptor.label;

	// initialise
	this.bind(module, id, descriptor);

	var t = this;
	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();

		// var startX = e.clientX;
		var startY = e.clientY;
		var startV = t.value;

		function mouseMove(e) {
			e.preventDefault();
			var delta = Math.max(-68, Math.min(68, startV + startY - e.clientY));
			t._mark.style.transform = 'rotate(' + (delta * 2) + 'deg)';
			t.value = delta;
			// TODO: add an option to not updating value in real time
			t.updateValue();
		}

		function mouseUp(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			t.updateValue();
		}

		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mouseup', mouseUp, false);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.bind = function (module, id, descriptor) {
	this.id       = id;
	this.module   = module;
	this.valueId  = descriptor.value || 'value';
	this.endPoint = module;

	var endPoint = descriptor.endPoint;
	if (endPoint) {
		endPoint = endPoint.split('.');
		for (var i = 0; i < endPoint.length; i++) {
			this.endPoint = this.endPoint[endPoint[i]];
		}
		// set default min max from AudioParam if exist
		// if (this.endPoint.minValue !== undefined) this.min = this.endPoint.minValue;
		// if (this.endPoint.maxValue !== undefined) this.max = this.endPoint.maxValue;
	}

	this.initValue();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.getState = function () {
	return this.value;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.initValue = function () {
	var value = this.endPoint[this.valueId];
	if (value === undefined) value = 0;
	this.value = map(value, this.min, this.max, -68, 68);
	this._mark.style.transform = 'rotate(' + (this.value * 2) + 'deg)';
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.updateValue = function () {
	var value = map(this.value, -68, 68, this.min, this.max);
	if (this.int) value = ~~Math.round(value);
	this.endPoint[this.valueId] = value;
};

module.exports = Knob;

