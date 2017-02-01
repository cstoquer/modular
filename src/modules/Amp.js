var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Amp() {
	this.node = audioContext.createGain();
	this.node.gain.value = 0;
	Module.call(this);
}
inherits(Amp, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Amp.prototype.descriptor = {
	type: 'Amp',
	name: 'Amp',
	size: 2,
	inputs:  { 
		IN:  { type: 'audio', x:3.5,  y:0, endPoint: 'node',      label: 'IN'  },
		MOD: { type: 'param', x:0.0,  y:1, endPoint: 'node.gain', label: 'MOD' },
	},
	outputs: { OUT: { type: 'audio', x:3.5,  y:1,   endPoint: 'node', label: 'OUT' } }
};

library.register(Amp);
module.exports = Amp;