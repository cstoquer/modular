var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

var FILTER_TYPE_ENUM = [
	'lowpass',
	'highpass',
	'bandpass',
	'lowshelf',
	'highshelf',
	'peaking',
	'notch',
	'allpass'
];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Filter(params) {
	this.node = audioContext.createBiquadFilter();
	this.type = 0;
	this.node.type = FILTER_TYPE_ENUM[this.type];
	
	Module.call(this, params);
}
inherits(Filter, Module);

Filter.prototype.switchType = function () {
	this.type = (this.type + 1) % FILTER_TYPE_ENUM.length;
	this.node.type = FILTER_TYPE_ENUM[this.type];
	this._title.textContent = this.node.type;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Filter.prototype.descriptor = {
	name: 'Filter',
	size: 4,
	inputs:  { IN:  { type: 'audio', x:0.5,  y:3, endPoint: 'node', label: 'IN' } },
	outputs: { OUT: { type: 'audio', x:3.0,  y:3,   endPoint: 'node', label: 'OUT' } },
	params:  {
		cutoff:   { type: 'knob', x: 2.0, y: 0.6, min: 10.0, max: 8000.0, endPoint: 'node.frequency', value: 'value', label: 'CUT' },
		resonace: { type: 'knob', x: 4.0, y: 0.6, min: 0.00, max: 40.0, endPoint: 'node.Q', value: 'value', label: 'REZ' },
		type:     { type: 'button', x: 0, y: 1.0, endPoint: 'switchType' }
	}
};

library.register(Filter);
module.exports = Filter;