var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Gain() {
	this.node = audioContext.createGain();
	Module.call(this);
}
inherits(Gain, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Gain.prototype.descriptor = {
	type: 'Gain',
	name: 'Gain x100',
	size: 3,
	inputs:  { IN:  { type: 'audio', x:3.5,  y:0.2, endPoint: 'node', label: 'IN'  } },
	outputs: { OUT: { type: 'audio', x:3.5,  y:2,   endPoint: 'node', label: 'OUT' } },
	controls: { gain: { type: 'knob', x: 1.5, y: 0.5, min: 1.0, max: 100.0, endPoint: 'node.gain', value: 'value', label: 'GAIN' } }
};

module.exports = Gain;