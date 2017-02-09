var audioContext = require('../core/audioContext');
var Filter       = require('./Filter');
var modules      = require('../core/modules');

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
function FilterMod() {
	Filter.call(this);
}
inherits(FilterMod, Filter);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
FilterMod.prototype.descriptor = {
	type: 'FilterMod',
	name: 'FilterMod',
	size: 3,
	inputs:  {
		IN:  { type: 'audio', x: 2.2,  y: 1, endPoint: 'node', label: 'IN' },
		CUT: { type: 'param', x: 0.0,  y: 1, endPoint: 'node.frequency', label: 'CUT', min: 10.0, max: 8000 },
		RES: { type: 'param', x: 0.0,  y: 2, endPoint: 'node.Q',         label: 'RES', min: 0.00, max: 40 }
	},
	outputs: { OUT: { type: 'audio', x: 2.2,  y: 2, endPoint: 'node', label: 'OUT' } },
	controls: {
		// cut:  { type: 'knob', x: 2.0, y: 0.3, min: 10.0, max: 8000.0, endPoint: 'node.frequency', value: 'value', label: 'CUT' },
		// res:  { type: 'knob', x: 4.0, y: 0.3, min: 0.00, max: 40.0,   endPoint: 'node.Q',         value: 'value', label: 'REZ' },
		type: { type: 'button', x: 4.2, y: 1.1, endPoint: 'switchType' }
	},
	persistent: ['filterType']
};

modules.register(FilterMod);
module.exports = FilterMod;