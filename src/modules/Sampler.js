var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Sampler() {
	this.node = audioContext.createBufferSource();
	this.bufferData = null;
	Module.call(this);
}
inherits(Sampler, Module);

Sampler.prototype.setBuffer = function (event) {
	if (event._type !== 'buffer') return;

	// a buffer can not be set again, we need to create new bufferSource.
	if (this.bufferData) {
		// save bufferSource state
		var rate = this.node.playbackRate.value;

		// remove current bufferSource
		this.node.disconnect();

		// create a new bufferSource
		this.node = audioContext.createBufferSource();
		this.bufferData = null;

		// set back saved state
		this.node.playbackRate.value = rate;

		// rebind everything
		this.rebind();
	}

	this.bufferData = event.buffer;

	var buffer = this.bufferData.buffer;
	var loop   = this.bufferData.loop || false;

	this.node.buffer = buffer;
	this.node.loop   = loop;

	if (loop) {
		// set loop points
		var loopStart = this.bufferData.start || 0;
		var loopEnd   = this.bufferData.end   || buffer.duration;
		// When loop end point is negative, we set endPoint from the end of the buffer
		if (loopEnd < 0) loopEnd = buffer.duration + loopEnd;
		if (loopEnd < 0) loopEnd = 0;

		this.node.loopStart = loopStart;
		this.node.loopEnd   = loopEnd;
	}

	this.node.start();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Sampler.prototype.descriptor = {
	type: 'Sampler',
	name: 'Sampler',
	size: 3,
	inputs:   { buffer: { type: 'event', x:0,    y:1, endPoint: 'setBuffer', label: 'BUF', /*singleConnection: true*/ } },
	outputs:  { OUT:    { type: 'audio', x:0,    y:2, endPoint: 'node',      label: 'OUT' } },
	controls: { rate:   { type: 'knob',  x: 3.7, y: 0.3, min: 0.01, max: 2, endPoint: 'node.playbackRate', value: 'value', label: 'RATE' } }
};

module.exports = Sampler;