var audioContext = require('../core/audioContext');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ProceduralBuffer(id, data) {
	this.id     = id;
	this.buffer = undefined;
	this.loop   = data.loop  || false;
	this.ir     = data.ir    || false;
	this.start  = data.start || 0;
	this.end    = data.end   || 0;
	this.engine = data.engine;
	this.params = data.params;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// static methods & attribute

ProceduralBuffer.deserialize = function (data) {
	// TODO: check for this ProceduralBuffer existence in the database
	return new ProceduralBuffer(data.id, data);
};

ProceduralBuffer.prototype.type = 'ProceduralBuffer';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ProceduralBuffer.prototype.serialize = function () {
	return {
		_type: 'ProceduralBuffer',
		id:     this.id,
		loop:   this.loop,
		ir:     this.ir,
		start:  this.start,
		end:    this.end,
		engine: this.engine,
		params: this.params
	};
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ProceduralBuffer.prototype.loadAudioBuffer = function (cb) {
	// TODO: call relevant engine.
	// check if buffer is already loaded
	if (!this.buffer) {
		var buffer = audioContext.createBuffer(1, 22050, 44100);
		var bufferData = buffer.getChannelData(0);
		for (var i = 0; i < bufferData.length; i++) {
			bufferData[i] = Math.random() - 0.5;
		}

		this.buffer = buffer;
	}

	return window.setTimeout(cb, 0);
}

module.exports = ProceduralBuffer;
