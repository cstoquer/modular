var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Context(params) {
	this.node = audioContext;
	Module.call(this, params);
}
inherits(Context, Module);

Context.prototype.descriptor = {
	name: 'Context',
	size: 1,
	inputs:  { DEST: { type: 'audio', x:3,  y:0, endPoint: 'node.destination', label: 'DEST' } },
	outputs: {},
	params:  {}
};

library.register(Context);
module.exports = Context;