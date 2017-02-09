var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AutoXFade() {
	this.gainA = audioContext.createGain();
	this.gainB = audioContext.createGain();
	this.mix   = audioContext.createGain();

	// internal connections
	this.gainA.connect(this.mix);
	this.gainB.connect(this.mix);

	// cross fade duration
	this.duration = 5;
	this.channel  = false; // false = channel A, true = channel B

	// initiatise audioParam
	this.gainA.gain.value = 1;
	this.gainB.gain.value = 0;

	Module.call(this);
}
inherits(AutoXFade, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AutoXFade.prototype.trigger = function () {
	var currentTime = audioContext.currentTime;

	this.channel = !this.channel;

	var valueA = this.gainA.gain.value;
	var valueB = this.gainB.gain.value;

	var targetA = this.channel ? 0 : 1;
	var targetB = this.channel ? 1 : 0;

	this.gainA.gain.cancelScheduledValues(0);
	this.gainB.gain.cancelScheduledValues(0);

	this.gainA.gain.setValueAtTime(valueA, currentTime);
	this.gainA.gain.linearRampToValueAtTime(targetA, currentTime + this.duration);

	this.gainB.gain.setValueAtTime(valueB, currentTime);
	this.gainB.gain.linearRampToValueAtTime(targetB, currentTime + this.duration);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AutoXFade.prototype.descriptor = {
	type: 'AutoXFade',
	name: 'AutoXFade',
	size: 4,
	inputs:  { 
		A:   { type: 'audio', x:0.0, y:0.8, endPoint: 'gainA', label: 'A'  },
		B:   { type: 'audio', x:0.0, y:1.8, endPoint: 'gainB', label: 'B'  },
		TRG: { type: 'event', x:0.0, y:3.2, endPoint: 'trigger', label: 'TRG' },
	},
	outputs: { 
		OUT: { type: 'audio', x:3.5, y:3.2, endPoint: 'mix', label: 'OUT' }
	},
	controls: { 
		duration: { type: 'knob', x: 2.2, y: 0.8, min: 0.5, max: 20, endPoint: null,  value: 'duration', label: 'TIME' },
		volume:   { type: 'knob', x: 4.2, y: 0.8, min: 0,   max: 1,  endPoint: 'mix.gain', value: 'value',    label: 'VOL' },
	}
};

module.exports = AutoXFade;