var audioContext = require('../../core/audioContext');

var SAMPLE_RATE = 44100;
var PI2 = Math.PI * 2;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Osc() {
	this.freq = 440;
	this.t = 0;
}

Osc.prototype.reset = function () {
	this.t = 0;
};

Osc.prototype.tic = function () {
	var inc = this.freq / SAMPLE_RATE;
	this.t += inc;
	if (this.t > 1) this.t -= 1;
	return Math.sin(this.t * PI2);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Envelope() {
	this.duration = 1;
	this.curve    = 0;
	this.t        = 0;
}

Envelope.prototype.reset = function () {
	this.t = 0;
	this.v = 1;
};

Envelope.prototype.tic = function() {
	// TODO: optimize
	var d = this.duration * SAMPLE_RATE;
	if (this.t > d) return;
	this.t += 1;
	this.v = Math.pow(1 - this.t / d, this.curve);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Synth() {
	// components
	this.osc = new Osc();
	this.modEnv = new Envelope();
	this.ampEnv = new Envelope();

	// attributes
	this.freq = 440;
	this.fmod  = 30;
}

Synth.prototype.reset = function () {
	this.osc.reset();
	this.modEnv.reset();
	this.ampEnv.reset();
};

Synth.prototype.tic = function () {
	// TODO: don't need to update each frame
	this.modEnv.tic();
	this.ampEnv.tic();

	this.osc.freq = this.freq + this.modEnv.v * this.fmod;

	return this.osc.tic() * this.ampEnv.v;
};

var synth = new Synth();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var DEFAULT_PARAMS = {
	freq:         440,
	mod:          300,
	ampDuration:  0.7,
	ampCurve:     0.2,
	modDuration:  0.7,
	modCurve:     0.5
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.generate = function (bufferData, cb) {
	// get sound informations
	var params = bufferData.params  || DEFAULT_PARAMS;
	var length = params.ampDuration || 1;

	// set synth params
	synth.reset();
	synth.freq            = params.freq;
	synth.fmod            = params.mod;
	synth.ampEnv.duration = params.ampDuration;
	synth.ampEnv.curve    = params.ampCurve;
	synth.modEnv.duration = params.modDuration;
	synth.modEnv.curve    = params.modCurve;

	// create buffer
	var buffer = audioContext.createBuffer(1, length * SAMPLE_RATE, SAMPLE_RATE);
	var channelData = buffer.getChannelData(0);

	// generate buffer data
	for (var i = 0; i < channelData.length; i++) {
		channelData[i] = synth.tic();
	}

	// append data
	bufferData.buffer = buffer;
	bufferData.start  = 0;
	bufferData.end    = length;

	// defer the callback
	return window.setTimeout(cb, 0);
};
