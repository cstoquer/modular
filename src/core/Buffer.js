var Module      = require('../core/Module');
var library     = require('../ui/moduleLibrary');
var audioEditor = require('../ui/audioEditor');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Buffer(bufferData) {
	Module.call(this, bufferData);

	var className = ' bufferAudio';
	if (bufferData.ir) className = ' bufferIR';
	if (bufferData.type === 'ProceduralBuffer') className = ' bufferProcedural';
	this._dom.className += className;

	this._title.textContent = bufferData.id;

	this.buffer = null;

	if (!bufferData) return console.warn('Buffer module should be initialized with buffer data.');

	var t = this;

	// load buffer
	bufferData.loadAudioBuffer(function onBufferLoaded(error) {
		if (error) {
			console.error('Could not load buffer', bufferData, error);
			// TODO: create a CSS class
			t._dom.className += ' bufferFailed';
			return;
		}
		t.buffer = bufferData;
		t.onLoad();
	});

	// edit buffer
	this._dom.addEventListener('dblclick', function () {
		audioEditor.setBuffer(bufferData);
		audioEditor.open();
	});
}
inherits(Buffer, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Buffer.prototype.onConnect = function (connector) {
	if (!this.buffer) return;
	this.$data.emitTo(connector, { _type: 'buffer', buffer: this.buffer });
};

Buffer.prototype.onLoad = function () {
	this.$data.emit({ _type: 'buffer', buffer: this.buffer });
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Buffer.prototype.descriptor = {
	type: 'Buffer',
	size: 1,
	outputs: { data: { type: 'event', x:5,  y:0, label: null, onConnect: 'onConnect' } }
};

module.exports = Buffer;
library.register(Buffer);
