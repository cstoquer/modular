var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ModDelay() {
	this.node = audioContext.createDelay(1);
	Module.call(this);
}
inherits(ModDelay, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModDelay.prototype.descriptor = {
	type: 'ModDelay',
	name: 'ModDelay',
	size: 2,
	inputs:  {
		time: { type: 'param', x:0,    y:1, endPoint: 'node.delayTime', label: 'TIME'  },
		IN:   { type: 'audio', x:3.6,  y:0, endPoint: 'node',           label: 'IN'  },
	},
	outputs: { OUT: { type: 'audio', x:3.6,  y:1, endPoint: 'node', label: 'OUT' } },
	controls: {}
};

library.register(ModDelay);
module.exports = ModDelay;