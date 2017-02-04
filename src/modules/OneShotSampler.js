var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function OneShotSampler() {
	this.node = audioContext.createBufferSource();
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

	// TODO: event can contain some data to alter the way the sample is player:
	// - pitch (playbackRate)
	// - start (startPosition)
	// - duration (duration)

	this._createBufferSource();
	this.node.start();
};

OneShotSampler.prototype._createBufferSource = function () {
	this.node.disconnect();
	this.node = audioContext.createBufferSource();
	this.rebind();
	this.node.buffer = this.bufferData.buffer;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
OneShotSampler.prototype.descriptor = {
	type: 'OneShotSampler',
	name: 'OneShotSample',
	size: 2,
	inputs:   {
		buffer:  { type: 'event', x:0, y:1, endPoint: 'setBuffer', label: 'BUF'  },
		trigger: { type: 'event', x:2.5, y:1, endPoint: 'trigger',   label: 'TRIG' }
	},
	outputs:  { OUT: { type: 'audio', x:5, y:1, endPoint: 'node' } },
	controls: { }
};

library.register(OneShotSampler);
module.exports = OneShotSampler;