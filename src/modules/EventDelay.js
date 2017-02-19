var Module = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function EventDelay() {
	this.delay = 10;
	Module.call(this);
}
inherits(EventDelay, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
EventDelay.prototype.onDataIn = function (event) {
	var t = this;

	// FIXME: cancel timeout on destroy
	window.setTimeout(function () {
		try {
			t.$OUT.emit(event);
		} catch (e) {
			// noop
		}
	}, this.delay * 1000);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
EventDelay.prototype.descriptor = {
	type: 'EventDelay',
	name: 'EventDelay',
	size: 2,
	inputs:  { IN:  { type: 'event', x:0,  y:0.9, label: 'IN', endPoint: 'onDataIn' } },
	outputs: { OUT: { type: 'event', x:2,  y:0.9, label: 'OUT' } },
	controls: { delay: { type: 'knob',  x: 4, y: 0, min: 1, max: 200, int: true, endPoint: null, value: 'delay' } }
};

module.exports = EventDelay;