var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var map          = require('../core/utils').map;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Fade() {
	this.target = 0.5;
	this.duration = 4;
	Module.call(this);
}
inherits(Fade, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Fade.prototype.onTrigger = function () {
	var currentTime = audioContext.currentTime;
	var target   = this.target;
	var duration = this.duration;

	this.$OUT.setAutomation(function (param, min, max) {
		var value = param.value;
		param.cancelScheduledValues(0);
		param.setValueAtTime(value, currentTime);
		param.linearRampToValueAtTime(map(target, 0, 1, min, max), currentTime + duration);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Fade.prototype.descriptor = {
	type: 'Fade',
	name: 'Fade',
	size: 3,
	inputs:  { TRG: { type: 'event', x:0, y:1, label: 'TRG', endPoint: 'onTrigger' } },
	outputs: { OUT: { type: 'param', x:0, y:2, label: 'ENV' } },
	controls: {
		target:   { type: 'knob', x: 2.1, y: 0.3, min: 0,   max: 1,  value: 'target',   label: 'TO' },
		duration: { type: 'knob', x: 4.0, y: 0.3, min: 0.1, max: 20, value: 'duration', label: 'TIME' },
	}
};

module.exports = Fade;