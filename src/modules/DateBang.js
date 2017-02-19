var Module = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function DateBang() {
	this._hour   = 12;
	this._minute = 0;
	this.data = null;
	this.dateTimeout = null;
	this.knobTimeout = null;
	Module.call(this);
}
inherits(DateBang, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
DateBang.prototype.onDataIn = function (event) {
	this.data = data;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
DateBang.prototype.updateTimeout = function () {
	var t = this;

	if (this.knobTimeout) window.clearTimeout(this.knobTimeout);

	// wait 1 seconds before setting the bang timeout in case the user is still changing data.
	this.knobTimeout = window.setTimeout(function () {
		t.setTimeout();
	}, 1000);
};

DateBang.prototype.setTimeout = function () {
	var t = this;

	// cancel previous timeout
	if (this.dateTimeout) window.clearTimeout(this.dateTimeout);

	// compute when next timeout should occurr (in minutes)
	var now = new Date();
	var n = now.getHours() * 60 + now.getMinutes();
	var d = this._hour     * 60 + this._minute;

	var delay = d - n;
	if (delay <= 0) delay = 24 * 60 + delay;

	// set timeout
	t.dateTimeout = window.setTimeout(function () {
		t.dateTimeout = null;
		t.$OUT.emit(t.data);
		t.setTimeout();
	}, delay * 60 * 1000);
};

DateBang.prototype.remove = function () {
	if (this.knobTimeout) window.clearTimeout(this.knobTimeout);
	if (this.dateTimeout) window.clearTimeout(this.dateTimeout);
	Module.prototype.remove.call(this);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Object.defineProperty(DateBang.prototype, 'hour', {
	get: function() {
		return this._hour;
	},
	set: function(value) {
		this._hour = value;
		this.updateTimeout();
	}
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Object.defineProperty(DateBang.prototype, 'minute', {
	get: function() {
		return this._minute;
	},
	set: function(value) {
		this._minute = value;
		this.updateTimeout();
	}
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
DateBang.prototype.descriptor = {
	type: 'DateBang',
	name: 'DateBang',
	size: 3,
	inputs:  { IN:  { type: 'event', x:3.5,  y:0, label: 'IN', endPoint: 'onDataIn', singleConnection: true } },
	outputs: { OUT: { type: 'event', x:3.5,  y:2, label: 'OUT' } },
	controls: {
		hour:   { type: 'knob',  x: 0,   y: 0.6, min: 0, max: 23, int: true, endPoint: null, value: 'hour',   label: 'HOUR' },
		minute: { type: 'knob',  x: 1.8, y: 0.6, min: 0, max: 59, int: true, endPoint: null, value: 'minute', label: 'MIN' },
	}
};

module.exports = DateBang;