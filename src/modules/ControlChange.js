var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');
var modules      = require('../core/modules');
var map          = require('../core/utils').map;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ControlChange() {
	this.channel = 0;
	this.control = 0;
	this.learn = false;
	this.glide = 0.1;
	Module.call(this);
	this._setTitle();
}
inherits(ControlChange, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ControlChange.prototype.onMessage = function (event) {
	if (event._type !== 'midi message') return;
	if (event.midiType !== 'control change') return;

	if (this.learn) {
		this.channel = event.channel;
		this.control = event.control;
		this.learn = false;
		this._dom.style.borderColor = '';
		this._setTitle();
		return;
	}

	if (event.channel !== this.channel) return;
	if (event.control !== this.control) return;

	var currentTime = audioContext.currentTime;

	var glide = this.glide;
	var value = map(event.value, 0, 127, 0, 1);

	this.$OUT.setAutomation(function (param, min, max) {
		param.cancelScheduledValues(0);
		param.setValueAtTime(param.value, currentTime);
		param.linearRampToValueAtTime(map(value, 0, 1, min, max), currentTime + glide);
	});
};

ControlChange.prototype.midiLearn = function () {
	this.learn = true;
	this._dom.style.borderColor = '#F00';
};

ControlChange.prototype._setTitle = function () {
	this.setTitle('CC#' + this.channel + ':' + this.control);
};

ControlChange.prototype.setState = function (state) {
	Module.prototype.setState.call(this, state);
	this._setTitle();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ControlChange.prototype.descriptor = {
	type: 'ControlChange',
	name: 'Control Change',
	size: 3,
	inputs:  { IN:  { type: 'event', x:0, y:1, label: 'IN', endPoint: 'onMessage' } },
	outputs: { OUT: { type: 'param', x:0, y:2, label: 'OUT' } },
	controls: {
		glide:  { type: 'knob', x: 4, y: 0.5, min: 0, max: 1, endPoint: '', value: 'glide', label: 'GLID' },
		midiLearn: { type: 'button', x: 2.3, y: 1, endPoint: 'midiLearn' }
	},
	persistent: ['channel', 'control']
};

modules.register(ControlChange);
module.exports = ControlChange;