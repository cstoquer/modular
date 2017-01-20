var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Gain(params) {
	this.node = audioContext.createGain();
	Module.call(this, params);
}
inherits(Gain, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Gain.prototype.descriptor = {
	name: 'Gain',
	size: 3,
	inputs:  { source:       { type: 'audio', x:3.5,  y:0.2, endPoint: 'node', label: 'IN' } },
	outputs: { destination:  { type: 'audio', x:3.5,  y:2,   endPoint: 'node', label: 'OUT' } },
	params:  { gain: { type: 'knob', x: 1.5, y: 0.5, min: 0.0, max: 100.0, endPoint: 'node.gain', value: 'value', label: 'GAIN' } }
};

library.register(Gain);
module.exports = Gain;