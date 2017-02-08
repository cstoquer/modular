var Module  = require('../core/Module');
var library = require('../ui/moduleLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AutoBang() {
	this.data     = null;
	this.duration = 20; // TODO
	this.timeout  = 0;
	// TODO: cancel timeout on unload

	Module.call(this);

	this.scheduleNext();
}
inherits(AutoBang, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AutoBang.prototype.onDataIn = function (data) {
	this.data = data;
};

AutoBang.prototype.scheduleNext = function () {
	var t = this;
	this.timeout = window.setTimeout(function () {
		t.$OUT.emit(this.data);
		t.scheduleNext();
	}, this.duration * 1000);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AutoBang.prototype.descriptor = {
	type: 'AutoBang',
	name: 'AutoBang',
	size: 2,
	inputs:  { IN:  { type: 'event', x:0,  y:1, label: 'DATA', endPoint: 'onDataIn' } },
	outputs: { OUT: { type: 'event', x:2.3,  y:1 } },
	controls: {
		duration: { type: 'knob', x: 4.0, y: 0.1, min: 1, max: 300, value: 'duration' },
	}
};

library.register(AutoBang);
module.exports = AutoBang;