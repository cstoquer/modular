var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Volume() {
	this.node = audioContext.createGain();
	Module.call(this);
}
inherits(Volume, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Volume.prototype.descriptor = {
	name: 'Volume',
	size: 3,
	inputs:  { IN: { type: 'audio', x:3.5,  y:0.2, endPoint: 'node', label: 'IN' } },
	outputs: { OUT: { type: 'audio', x:3.5,  y:2,   endPoint: 'node', label: 'OUT' } },
	params:  { volume: { type: 'knob', x: 1.5, y: 0.5, min: 0.0, max: 1.0, endPoint: 'node.gain', value: 'value', label: 'VOL' } }
};

library.register(Volume);
module.exports = Volume;