var audioContext = require('../core/audioContext');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ProceduralBuffer(id, data) {
	this.id     = id;
	this.buffer = undefined;
	this.loop   = data.loop;
	this.start  = data.start;
	this.end    = data.end;
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
		id:    this.id,
		// uri:   this.uri,
		loop:  this.loop,
		start: this.start,
		end:   this.end
	};
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ProceduralBuffer.prototype.loadAudioBuffer = function (cb) {
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
