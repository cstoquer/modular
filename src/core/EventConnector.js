var connectors = require('./connectors');
var Connector  = require('./Connector');

var EVENT_CABLE_COLOR = '#2da8ff';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getEndPoint(module, endPointDescriptor) {
	endPointDescriptor = endPointDescriptor || '';
	endPointDescriptor = endPointDescriptor.split('.');
	endPoint = module;
	for (var i = 0; i < endPointDescriptor.length; i++) {
		endPoint = endPoint[endPointDescriptor[i]];
	}
	return endPoint
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function EventInput(module, id, descriptor) {
	// this.module = module;
	Connector.call(this, module, id, descriptor);
	this.onConnect    = descriptor.onConnect    ? getEndPoint(module, descriptor.onConnect)    : null;
	this.onDisconnect = descriptor.onDisconnect ? getEndPoint(module, descriptor.onDisconnect) : null;
}
inherits(EventInput, Connector);
EventInput.prototype.cssClassName = 'eventIn';
EventInput.prototype.color = EVENT_CABLE_COLOR;
EventInput.prototype.type  = 'event';
EventInput.prototype.way   = 'input';
connectors.register(EventInput, 'input', 'event');

EventInput.prototype.bind = function (module, id, descriptor) {
	// An event input endPoint is a reference to a function of the module 
	// that will be called when an event comes in.
	this.endPoint = getEndPoint(module, descriptor.endPoint);
};

EventInput.prototype.connect = function (connector) {
	// Connector.prototype.connect.call(this, connector);
	connector.connect(this);
	if (this.onConnect) this.onConnect.call(this.module, connector);
};

EventInput.prototype.disconnect = function (connector) {
	if (this.onDisconnect) this.onDisconnect.call(this.module, connector);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function EventOutput(module, id, descriptor) {
	Connector.call(this, module, id, descriptor);
	// event output endPoints is an array of EventInput connector references.
	this.connections  = [];
	this.onConnect    = descriptor.onConnect    ? getEndPoint(module, descriptor.onConnect)    : null;
	this.onDisconnect = descriptor.onDisconnect ? getEndPoint(module, descriptor.onDisconnect) : null;
}
inherits(EventOutput, Connector);
EventOutput.prototype.cssClassName = 'eventOut';
EventOutput.prototype.color = EVENT_CABLE_COLOR;
EventOutput.prototype.type  = 'event';
EventOutput.prototype.way   = 'output';
connectors.register(EventOutput, 'output', 'event');

EventOutput.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	this.connections.push(connector);
	if (this.onConnect) this.onConnect.call(this.module, connector);
};

EventOutput.prototype.disconnect = function (connector) {
	var index = this.connections.indexOf(connector);
	if (index === -1) return;
	this.connections.splice(index, 1);
	if (this.onDisconnect) this.onDisconnect.call(this.module, connector);
};

EventOutput.prototype.emit = function (event) {
	event = event || {};
	for (var i = 0; i < this.connections.length; i++) {
		var connector = this.connections[i];
		// bind to the correct 'this' value (the connector's module)
		connector.endPoint.call(connector.module, event, this);
	}
};

EventOutput.prototype.emitTo = function (connector, event) {
	connector.endPoint.call(connector.module, event, this);
};
