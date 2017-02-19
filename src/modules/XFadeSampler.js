var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function XFadeSampler() {
	// main mix
	this.node = audioContext.createGain();

	// current sample
	this.bufferSource = null;
	this.fadeGain     = null;

	// fade durations
	this.fadeIn  = 5;
	this.fadeOut = 5;

	Module.call(this);
}
inherits(XFadeSampler, Module);

XFadeSampler.prototype.setBuffer = function (event) {
	if (event._type !== 'buffer') return;
	var bufferData = event.buffer;

	var currentTime = audioContext.currentTime;

	if (this.bufferSource) {
		// fade out previous sound
		var previousBufferSource = this.bufferSource;
		var previousFadeGain     = this.fadeGain;
		var param = previousFadeGain.gain;
		param.cancelScheduledValues(0);
		param.setValueAtTime(param.value, currentTime);
		param.linearRampToValueAtTime(0, currentTime + this.fadeOut);

		// schedule stop and disconnections
		window.setTimeout(function disconnectBufferSource() {
			previousBufferSource.stop();
			previousBufferSource.disconnect();
			previousFadeGain.disconnect();
		}, this.fadeOut * 1000);
	}

	// create new sound
	var bufferSource = audioContext.createBufferSource();
	var fadeGain     = audioContext.createGain();
	bufferSource.connect(fadeGain);
	fadeGain.connect(this.node);

	bufferSource.buffer = bufferData.buffer;

	// event can contain some data to alter the way the sample is played:
	if (event.playbackRate) bufferSource.playbackRate.value = event.playbackRate;
	var offset = event.offset || 0;
	// TODO: duration (not nullable, must be >= 0)

	// fade in new sound
	var param = fadeGain.gain;
	param.setValueAtTime(0, currentTime);
	param.linearRampToValueAtTime(1, currentTime + this.fadeIn);

	// set loop
	var loop = bufferData.loop || false;
	bufferSource.loop = loop;

	if (loop) {
		// set loop points
		var loopStart = bufferData.start || 0;
		var loopEnd   = bufferData.end   || bufferData.buffer.duration;
		// When loop end point is negative, we set endPoint from the end of the buffer
		if (loopEnd < 0) loopEnd = bufferData.buffer.duration + loopEnd;
		if (loopEnd < 0) loopEnd = 0;

		bufferSource.loopStart = loopStart;
		bufferSource.loopEnd   = loopEnd;
	}

	// start sound
	bufferSource.start(0, offset);

	// keep references
	this.bufferSource = bufferSource;
	this.fadeGain     = fadeGain;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
XFadeSampler.prototype.descriptor = {
	type: 'XFadeSampler',
	name: 'XFadeSampler',
	size: 4,
	inputs:   {
		buffer:  { type: 'event', x:0.5, y:3.1, endPoint: 'setBuffer', label: 'BUF' }
	},
	outputs:  { OUT: { type: 'audio', x:4.5, y:3.1, endPoint: 'node' } },
	controls: {
		fadeIn:  { type: 'knob', x: 0, y: 0.7, min: 1, max: 20, endPoint: null, value: 'fadeIn',  label: 'IN'  },
		fadeOut: { type: 'knob', x: 2, y: 0.7, min: 1, max: 20, endPoint: null, value: 'fadeOut', label: 'OUT' },
		volume:  { type: 'knob', x: 4, y: 0.7, min: 0, max: 1,  endPoint: 'node.gain', value: 'value', label: 'VOL' },
	}
};

module.exports = XFadeSampler;