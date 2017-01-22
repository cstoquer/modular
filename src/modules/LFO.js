var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function LFO(params) {
	this.node = audioContext.createOscillator();
	this.node.frequency.value = 2.0;
	// this.node.type = 'square';
	this.node.start();
	Module.call(this, params);
}
inherits(LFO, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
LFO.prototype.descriptor = {
	name: 'LFO',
	size: 3,
	inputs:  { detune: { type: 'audio', x:0,  y:1, endPoint: 'node.detune', label: 'DTN' } },
	outputs: { OUT:  { type: 'audio', x:0,  y:2, endPoint: 'node', label: 'OUT' } },
	params:  { frequency: { type: 'knob', x: 3.7, y: 0.3, min: 0.01, max: 20.0, endPoint: 'node.frequency', value: 'value', label: 'FREQ' } }
};

library.register(LFO);
module.exports = LFO;