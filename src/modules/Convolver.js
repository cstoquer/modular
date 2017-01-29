var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Convolver() {
	this.node = audioContext.createConvolver();
	this.bufferData = null;
	Module.call(this);
}
inherits(Convolver, Module);

Convolver.prototype.setBuffer = function (event) {
	if (event._type !== 'buffer') return;

	// a buffer can not be set again, we need to create new convolver.
	if (this.bufferData) {
		// remove current convolver
		this.node.disconnect();

		// create a new convolver
		this.node = audioContext.createConvolver();
		this.bufferData = null;

		// rebind everything
		this.rebind();
	}

	this.bufferData = event.buffer;
	var buffer = this.bufferData.buffer;
	this.node.buffer = buffer;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Convolver.prototype.descriptor = {
	type: 'Convolver',
	name: 'Convolver',
	size: 3,
	inputs: {
		IN:     { type: 'audio', x:3, y:1, endPoint: 'node',      label: 'IN' },
		buffer: { type: 'event', x:0, y:1, endPoint: 'setBuffer', label: 'BUF', /*singleConnection: true*/ },
	},
	outputs:  { OUT: { type: 'audio', x:3, y:2, endPoint: 'node', label: 'OUT' } },
	controls: {}
};

library.register(Convolver);
module.exports = Convolver;