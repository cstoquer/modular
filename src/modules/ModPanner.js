var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ModPanner(params) {
	this.node = audioContext.createStereoPanner();
	Module.call(this, params);
}
inherits(ModPanner, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModPanner.prototype.descriptor = {
	name: 'ModPan',
	size: 2,
	inputs:  { 
		source: { type: 'audio', x:3.5,  y:0, endPoint: 'node', label: 'IN' },
		pan:    { type: 'audio', x:0.0,  y:1, endPoint: 'node.pan', label: 'PAN' },
	},
	outputs: { destination:  { type: 'audio', x:3.5,  y:1,   endPoint: 'node', label: 'OUT' } },
	params:  {}
};

library.register(ModPanner);
module.exports = ModPanner;