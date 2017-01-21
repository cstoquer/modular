var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Sampler(params) {
	this.node   = audioContext.createBufferSource();
	this.buffer = window.testBuffer; // TODO
	// this.node.start();
	Module.call(this, params);
}
inherits(Sampler, Module);

Sampler.prototype.start = function () {
	// TODO
	this.node.loop   = true;
	this.node.buffer = this.buffer;
	this.node.start()
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Sampler.prototype.descriptor = {
	name: 'Sampler',
	size: 3,
	inputs:  { start:        { type: 'event', x:0,  y:1, endPoint: 'start', label: 'TRG' } },
	outputs: { destination:  { type: 'audio', x:0,  y:2, endPoint: 'node', label: 'OUT' } },
	params:  { rate: { type: 'knob', x: 3.7, y: 0.3, min: 0.1, max: 5, endPoint: 'node.playbackRate', value: 'value', label: 'RATE' } }
};

library.register(Sampler);
module.exports = Sampler;