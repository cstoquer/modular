var Module = require('../core/Module');
var map    = require('../core/utils').map;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function RandomBang() {
	this.data     = null;
	this.min      = 5;
	this.max      = 20;
	this.timeout  = null;

	Module.call(this);

	this.scheduleNext();
}
inherits(RandomBang, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
RandomBang.prototype.onDataIn = function (data) {
	this.data = data;
};

RandomBang.prototype.scheduleNext = function () {
	var t = this;
	var duration = map(Math.random(), 0, 1, this.min, this.max);
	this.timeout = window.setTimeout(function () {
		t.$OUT.emit(this.data);
		t.scheduleNext();
	}, duration * 1000);
};

RandomBang.prototype.remove = function () {
	// cancel timeout on unload
	if (this.timeout !== null) {
		window.clearTimeout(this.timeout);
		this.timeout = null;
	}
	Module.prototype.remove.call(this);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
RandomBang.prototype.descriptor = {
	type: 'RandomBang',
	name: 'RandomBang',
	size: 3,
	inputs:  { IN:  { type: 'event', x:5,  y:1, endPoint: 'onDataIn' } },
	outputs: { OUT: { type: 'event', x:5,  y:2 } },
	controls: {
		min: { type: 'knob', x: 0.5, y: 0.5, min: 1, max: 100, value: 'min', label: 'MIN' },
		max: { type: 'knob', x: 2.5, y: 0.5, min: 1, max: 100, value: 'max', label: 'MAX' },
	}
};

module.exports = RandomBang;