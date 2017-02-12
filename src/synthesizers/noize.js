var audioContext = require('../core/audioContext');

var SAMPLE_RATE = 44100;
var m_brown     = 0.0;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function white() {
	return Math.random() - 0.5;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function brown() {
	while (true) {
		var r = white();
		m_brown += r;
		if (m_brown < -8.0 || m_brown > 8.0) m_brown -= r;
		else break;
	}
	return m_brown / 16;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function colored(color) {
	return brown() * color + white() * (1 - color);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.generate = function (bufferData, cb) {
	// get sound informations
	var params = bufferData.params;
	var length = params.length || 1;
	var color  = params.color  || 0;
	var noisef = colored;
	if (color < 0) noisef = white;
	if (color > 1) noisef = brown;

	// create buffer
	var buffer = audioContext.createBuffer(1, length * SAMPLE_RATE, SAMPLE_RATE);

	// generate buffer data
	var channelData = buffer.getChannelData(0);
	for (var i = 0; i < channelData.length; i++) {
		channelData[i] = noisef(color);
	}

	// append data
	bufferData.buffer = buffer;
	bufferData.start  = 0;
	bufferData.end    = length;

	// defer the callback
	return window.setTimeout(cb, 0);
}