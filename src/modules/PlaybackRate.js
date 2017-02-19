var Module = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function PlaybackRate() {
	this.playbackRate = 1;
	this.data = null;
	Module.call(this);
}
inherits(PlaybackRate, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
PlaybackRate.prototype.onDataIn = function (event) {
	// adding circular check object
	if (!event._circular) event._circular = {};
	if (event._circular[this.id]) return; // circular loop detected
	event._circular[this.id] = true;

	// adding or overwriting attribute
	event.playbackRate = this.playbackRate;

	// keep event copy for onConnect FIXME: only last event is kept
	this.data = event;

	// emit event
	this.$OUT.emit(event);
};

PlaybackRate.prototype.onConnect = function (connector) {
	if (!this.data) return;
	this.$OUT.emitTo(connector, this.data);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
PlaybackRate.prototype.descriptor = {
	type: 'PlaybackRate',
	name: 'PlaybackRate',
	size: 3,
	inputs:  { IN:  { type: 'event', x:0.5,  y:1.5, endPoint: 'onDataIn' } },
	outputs: { OUT: { type: 'event', x:4.5,  y:1.5, onConnect: 'onConnect' } },
	controls: { rate: { type: 'knob',  x: 2, y: 1, min: 0.01, max: 2, endPoint: null, value: 'playbackRate' } }
};

module.exports = PlaybackRate;