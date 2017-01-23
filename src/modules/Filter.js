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
	this._filterType = 0;
	this.node.type = FILTER_TYPE_ENUM[this._filterType].id;
	
	Module.call(this);
	this.$$type.setTitle(FILTER_TYPE_ENUM[this._filterType].caption);
}
inherits(Filter, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Filter.prototype.switchType = function () {
	this.filterType += 1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Object.defineProperty(Filter.prototype, 'filterType', {
	get: function() {
		return this._filterType;
	},
	set: function(value) {
		this._filterType = value % FILTER_TYPE_ENUM.length;
		this.node.type = FILTER_TYPE_ENUM[this._filterType].id;
		this.$$type.setTitle(FILTER_TYPE_ENUM[this._filterType].caption);
	}
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Filter.prototype.descriptor = {
	type: 'Filter',
	name: 'Filter',
	size: 4,
	inputs:  { IN:  { type: 'audio', x:0.5,  y:3, endPoint: 'node', label: 'IN' } },
	outputs: { OUT: { type: 'audio', x:3.0,  y:3, endPoint: 'node', label: 'OUT' } },
	controls: {
		cut:  { type: 'knob', x: 2.0, y: 0.3, min: 10.0, max: 8000.0, endPoint: 'node.frequency', value: 'value', label: 'CUT' },
		res:  { type: 'knob', x: 4.0, y: 0.3, min: 0.00, max: 40.0,   endPoint: 'node.Q',         value: 'value', label: 'REZ' },
		type: { type: 'button', x: 0.2, y: 1.2, endPoint: 'switchType' }
	},
	persistent: ['filterType']
};

library.register(Filter);
module.exports = Filter;