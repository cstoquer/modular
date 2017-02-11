var audioContext = require('../core/audioContext');

var SAMPLE_RATE = 44100;

exports.generate = function (bufferData, cb) {
	// get sound informations
	var params = bufferData.params;
	var length = params.length || 1;

	// create buffer
	var buffer = audioContext.createBuffer(1, length * SAMPLE_RATE, SAMPLE_RATE);

	// generate buffer data
	var channelData = buffer.getChannelData(0);
	for (var i = 0; i < channelData.length; i++) {
		channelData[i] = Math.random() - 0.5;
	}

	// append data
	bufferData.buffer = buffer;
	bufferData.start  = 0;
	bufferData.end    = length;

	// defer the callback
	return window.setTimeout(cb, 0);
}