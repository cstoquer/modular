var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function OneShotSampler() {
	this.node = audioContext.createGain();
	this.bufferData = null;
	Module.call(this);
}
inherits(OneShotSampler, Module);

OneShotSampler.prototype.setBuffer = function (event) {
	if (event._type !== 'buffer') return;
	this.bufferData = event.buffer;
};

OneShotSampler.prototype.trigger = function (event) {
	if (!this.bufferData) return;

	var bufferSource = audioContext.createBufferSource();
	bufferSource.connect(this.node);
	bufferSource.buffer = this.bufferData.buffer;

	// event can contain some data to alter the way the sample is played:
	if (event.playbackRate) bufferSource.playbackRate.value = event.playbackRate;
	var offset = event.offset || 0;
	// TODO: duration (not nullable, must be >= 0)

	bufferSource.start(0, offset);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
OneShotSampler.prototype.descriptor = {
	type: 'OneShotSampler',
	name: 'OneShot',
	size: 3,
	inputs:   {
		buffer:  { type: 'event', x:0, y:2, endPoint: 'setBuffer', label: 'BUF'  },
		trigger: { type: 'event', x:0, y:1, endPoint: 'trigger',   label: 'TRIG' }
	},
	outputs:  { OUT: { type: 'audio', x:5, y:2, endPoint: 'node' } },
	controls: { volume: { type: 'knob', x: 2.8, y: 0.5, min: 0, max: 1, endPoint: 'node.gain', value: 'value', label: 'VOL' } }
};

module.exports = OneShotSampler;