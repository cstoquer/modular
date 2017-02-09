var map = require('./utils').map;

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

	this.initGUI(module, id, descriptor);

	// initialise
	this.bind(module, id, descriptor);
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
/** Initialise Knob properties according to the endPoint current value */
Knob.prototype.initValue = function () {
	var value = this.endPoint[this.valueId];
	if (value === undefined) value = 0;
	this.value = map(value, this.min, this.max, -68, 68);
	this.updateGUI();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Set endPoint value in respect to the knob internal value */
Knob.prototype.updateValue = function () {
	var value = map(this.value, -68, 68, this.min, this.max);
	if (this.int) value = ~~Math.round(value);
	this.endPoint[this.valueId] = value;
	this.displayValue(value);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.getState = function () {
	return this.value;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.setState = function (value) {
	this.value = value;
	this.updateValue();
	this.updateGUI();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Knob.prototype.initGUI = function (module, id, descriptor) {};
Knob.prototype.updateGUI = function () {};
Knob.prototype.displayValue = function (value) {};

module.exports = Knob;
