var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var modules      = require('../core/modules');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Context() {
	this.node = audioContext;
	Module.call(this);
}
inherits(Context, Module);

Context.prototype.descriptor = {
	type: 'Context',
	name: 'Context',
	size: 1,
	inputs: { DEST: { type: 'audio', x:3,  y:0, endPoint: 'node.destination', label: 'DEST' } }
};

modules.register(Context);
module.exports = Context;