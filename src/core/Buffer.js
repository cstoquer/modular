var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function loadAudioBuffer(path, cb) {
	var xobj = new XMLHttpRequest();
	xobj.responseType = 'arraybuffer';

	xobj.onreadystatechange = function onXhrStateChange() {
		if (~~xobj.readyState !== 4) return;
		if (~~xobj.status !== 200 && ~~xobj.status !== 0) {
			return cb('xhrError:' + xobj.status);
		}
		audioContext.decodeAudioData(xobj.response, function onSuccess(buffer) {
			return cb(null, buffer);
		}, cb);
	};

	xobj.open('GET', path, true);
	xobj.send();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Buffer(bufferData, id) {
	Module.call(this);

	// TODO: create a CSS class
	this._dom.style.backgroundColor = '#7cd4a7';
	this._dom.style.borderColor     = '#c1f1d0';
	this._dom.style.borderRadius    = '4px';
	this._title.textContent = id;

	this.buffer = null;

	if (!bufferData) return console.warn('Buffer module should be initialized with buffer data.');

	var t = this;

	// check if buffer is already loaded
	if (bufferData.buffer) {
		this.buffer = bufferData;
		window.setTimeout(function () {
			t.onLoad();
		}, 0);
		return;
	}

	// load buffer
	loadAudioBuffer(bufferData.uri, function onBufferLoaded(error, buffer) {
		if (error) {
			console.error('Could not load buffer', bufferData, error);
			t._dom.style.backgroundColor = '#ea455c';
			t._dom.style.borderColor     = '#dc9797';
			return;
		}
		bufferData.buffer = buffer;
		t.buffer = bufferData;
		t.onLoad();
	});
}
inherits(Buffer, Module);

Buffer.prototype.onConnect = function (connector) {
	if (!this.buffer) return;
	this.$data.emitTo(connector, { _type: 'buffer', buffer: this.buffer });
};

Buffer.prototype.onLoad = function () {
	this.$data.emit({ _type: 'buffer', buffer: this.buffer });
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Buffer.prototype.descriptor = {
	name: 'Buffer',
	size: 1,
	inputs:  {},
	outputs: { data: { type: 'event', x:5,  y:0, label: null, onConnect: 'onConnect' } },
	params:  {}
};

module.exports = Buffer;