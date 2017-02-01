var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var library      = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Envelope() {
	Module.call(this);
}
inherits(Envelope, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Envelope.prototype.onTrigger = function () {
	var currentTime = audioContext.currentTime;

	var ATTACK  = 1;
	var SUSTAIN = 1;
	var RELEASE = 2;

	this.$OUT.setAutomation(function (param) {
		var value = param.value;
		param.cancelScheduledValues(0);

		param.setValueAtTime(value, currentTime);
		param.linearRampToValueAtTime(1, currentTime + ATTACK);
		param.setValueAtTime(1, currentTime + ATTACK + SUSTAIN);
		param.linearRampToValueAtTime(0, currentTime + ATTACK + SUSTAIN + RELEASE);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Envelope.prototype.descriptor = {
	type: 'Envelope',
	name: 'Envelope',
	size: 2,
	inputs:  { TRG: { type: 'event', x:0,    y:1, label: 'TRG', endPoint: 'onTrigger' } },
	outputs: { OUT: { type: 'param', x:3.5,  y:1, label: 'OUT' } },
	controls: {}
};

library.register(Envelope);
module.exports = Envelope;