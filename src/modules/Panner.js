var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Panner() {
	this.node = audioContext.createStereoPanner();
	Module.call(this);
}
inherits(Panner, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Panner.prototype.descriptor = {
	type: 'Panner',
	name: 'Pan',
	size: 2,
	inputs:   { IN:  { type: 'audio', x:3.5,  y: 0, endPoint: 'node', label: 'IN'  } },
	outputs:  { OUT: { type: 'audio', x:3.5,  y: 1, endPoint: 'node', label: 'OUT' } },
	controls: { pan: { type: 'knob',  x: 1.5, y: 0, min: -1, max: 1, endPoint: 'node.pan', value: 'value' } }
};

library.register(Panner);
module.exports = Panner;