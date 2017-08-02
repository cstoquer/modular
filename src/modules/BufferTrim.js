var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function BufferTrim() {
	this.buffer = null;
	Module.call(this);
}
inherits(BufferTrim, Module);

BufferTrim.prototype.setBuffer = function (event) {
	if (event._type !== 'buffer') return;

	var sourceBuffer     = event.buffer.buffer;
	var numberOfChannels = sourceBuffer.numberOfChannels;
	var sampleRate       = sourceBuffer.sampleRate;
	var offset           = event.buffer.start * sampleRate;
	var bufferLength     = sourceBuffer.length - offset;

	// trim end
	if (event.buffer.end) {
		if (event.buffer.end > 0) {
			bufferLength = (event.buffer.end - event.buffer.start) * sampleRate;
		} else {
			bufferLength += event.buffer.end * sampleRate;
		}
	}

	var buffer = audioContext.createBuffer(numberOfChannels, bufferLength, sampleRate);

	for (var channel = 0; channel < numberOfChannels; channel++) {
		// buffer.copyToChannel(sourceBuffer.getChannelData(channel), channel, 0);
		sourceBuffer.copyFromChannel(buffer.getChannelData(channel), channel, offset);
	}

	this.buffer = {
		buffer: buffer,
		start: 0,
		end: 0, // TODO
		loop: false // TODO
	};

	this.$data.emit({ _type: 'buffer', buffer: this.buffer });
};

BufferTrim.prototype.onConnect = function (connector) {
	if (!this.buffer) return;
	this.$data.emitTo(connector, { _type: 'buffer', buffer: this.buffer });
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferTrim.prototype.descriptor = {
	type: 'BufferTrim',
	name: 'BufferTrim',
	size: 2,
	inputs:   { buffer: { type: 'event', x:0, y:1, endPoint: 'setBuffer', label: 'BUF', singleConnection: true } },
	outputs:  { data:   { type: 'event', x:3,  y:1, label: 'TRIM', onConnect: 'onConnect' } },
	controls: {  }
};

module.exports = BufferTrim;