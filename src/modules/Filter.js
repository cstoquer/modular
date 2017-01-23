var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

var FILTER_TYPE_ENUM = [
	{ id: 'lowpass',  caption: 'LP' },
	{ id: 'highpass', caption: 'HP' },
	{ id: 'bandpass', caption: 'BP' },
	// 'lowshelf',
	// 'highshelf',
	// 'peaking',
	// 'notch',
	// 'allpass'
];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Filter() {
	this.node = audioContext.createBiquadFilter();
	this.type = 0;
	this.node.type = FILTER_TYPE_ENUM[this.type].id;
	
	Module.call(this);
	this.$$type.setTitle(FILTER_TYPE_ENUM[this.type].caption);
}
inherits(Filter, Module);

Filter.prototype.switchType = function () {
	this.type = (this.type + 1) % FILTER_TYPE_ENUM.length;
	this.node.type = FILTER_TYPE_ENUM[this.type].id;
	// this._title.textContent = this.node.type;
	this.$$type.setTitle(FILTER_TYPE_ENUM[this.type].caption);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Filter.prototype.descriptor = {
	name: 'Filter',
	size: 4,
	inputs:  { IN:  { type: 'audio', x:0.5,  y:3, endPoint: 'node', label: 'IN' } },
	outputs: { OUT: { type: 'audio', x:3.0,  y:3,   endPoint: 'node', label: 'OUT' } },
	params:  {
		cutoff:   { type: 'knob', x: 2.0, y: 0.3, min: 10.0, max: 8000.0, endPoint: 'node.frequency', value: 'value', label: 'CUT' },
		resonace: { type: 'knob', x: 4.0, y: 0.3, min: 0.00, max: 40.0, endPoint: 'node.Q', value: 'value', label: 'REZ' },
		type:     { type: 'button', x: 0.2, y: 1.2, endPoint: 'switchType' }
	}
};

library.register(Filter);
module.exports = Filter;