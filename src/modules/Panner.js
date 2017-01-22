var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Panner(params) {
	this.node = audioContext.createStereoPanner();
	Module.call(this, params);
}
inherits(Panner, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Panner.prototype.descriptor = {
	name: 'Pan',
	size: 2,
	inputs:  { IN: { type: 'audio', x:3.5,  y:0, endPoint: 'node', label: 'IN' } },
	outputs: { OUT: { type: 'audio', x:3.5,  y:1,   endPoint: 'node', label: 'OUT' } },
	params:  { pan: { type: 'knob', x: 1.5, y: 0, min: -1, max: 1, endPoint: 'node.pan', value: 'value' } }
};

library.register(Panner);
module.exports = Panner;