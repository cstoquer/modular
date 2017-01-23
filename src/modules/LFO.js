var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function LFO() {
	this.node = audioContext.createOscillator();
	this.node.frequency.value = 2.0;
	// this.node.type = 'square';
	this.node.start();
	Module.call(this);
}
inherits(LFO, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
LFO.prototype.descriptor = {
	type: 'LFO',
	name: 'LFO',
	size: 3,
	inputs:  {},
	outputs: { OUT:    { type: 'audio', x:5,  y:1, endPoint: 'node', label: null } },
	controls: { frequency: { type: 'knob', x: 2.2, y: 0.3, min: 0.001, max: 10.0, endPoint: 'node.frequency', value: 'value', label: 'FREQ' } }
};

library.register(LFO);
module.exports = LFO;