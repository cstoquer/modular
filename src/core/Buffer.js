var Module  = require('../core/Module');
var library = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Buffer(bufferData) {
	Module.call(this, bufferData);

	// TODO: create a CSS class
	this._dom.style.backgroundColor = '#7cd4a7';
	this._dom.style.borderColor     = '#c1f1d0';
	this._dom.style.borderRadius    = '4px';
	this._title.textContent = bufferData.id;

	this.buffer = null;

	if (!bufferData) return console.warn('Buffer module should be initialized with buffer data.');

	var t = this;

	// load buffer
	bufferData.loadAudioBuffer(function onBufferLoaded(error) {
		if (error) {
			console.error('Could not load buffer', bufferData, error);
			// TODO: create a CSS class
			t._dom.style.backgroundColor = '#ea455c';
			t._dom.style.borderColor     = '#dc9797';
			return;
		}
		t.buffer = bufferData;
		t.onLoad();
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
