var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var modules      = require('../core/modules');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Oscillator() {
	this.node = audioContext.createOscillator();
	this.node.frequency.value = 220.0;
	// this.node.type = 'square';
	this.node.start();
	Module.call(this);
}
inherits(Oscillator, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Oscillator.prototype.descriptor = {
	type: 'Oscillator',
	name: 'Oscillator',
	size: 3,
	inputs:   { detune: { type: 'param', x:0,  y:1, endPoint: 'node.detune', label: 'DTN' } },
	outputs:  { OUT:    { type: 'audio', x:0,  y:2, endPoint: 'node',        label: 'OUT' } },
	controls: { frequency: { type: 'knob', x: 3.7, y: 0.3, min: 110.0, max: 880.0, endPoint: 'node.frequency', value: 'value', label: 'FREQ' } }
};

modules.register(Oscillator);
module.exports = Oscillator;