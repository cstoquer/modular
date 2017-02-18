var Module = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function EventPool() {
	Module.call(this);
	this.map   = new WeakMap();
	this.data  = [];
	this.index = 0;
}
inherits(EventPool, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
EventPool.prototype.removeData = function (connector) {
	var data = this.map.get(connector);
	if (!data) return;
	this.map.delete(connector);
	var index = this.data.indexOf(data);
	if (index === -1) return console.error('data not in the pool');
	this.data.splice(index, 1);
};

EventPool.prototype.onDataIn = function (data, connector) {
	this.removeData(connector);
	this.map.set(connector, data);
	this.data.push(data);
};

EventPool.prototype.onDisconnect = function (connector) {
	this.removeData(connector);
};

EventPool.prototype.onTrigger = function (event) {
	if (this.data.length === 0) return;
	// TODO: input event can control which data to emit (next, previous, same, random)
	this.index = (this.index + 1) % this.data.length; // next data
	this.$OUT.emit(this.data[this.index]);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
EventPool.prototype.descriptor = {
	type: 'EventPool',
	name: 'EventPool',
	size: 2,
	inputs:  {
		IN:  { type: 'event', x:0,  y:1, label: 'DATA', endPoint: 'onDataIn', onDisconnect: 'onDisconnect' },
		TRG: { type: 'event', x:3.5, y:0, label: 'TRG',  endPoint: 'onTrigger' }
	},
	outputs: {
		OUT: { type: 'event', x:3.5, y:1, label: 'OUT' }
	},
	controls: {}
};

module.exports = EventPool;