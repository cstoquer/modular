var connectors = require('./connectors');
var Connector  = require('./Connector');

var EVENT_CABLE_COLOR = '#2da8ff';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function EventInput(module, id, descriptor) {
	Connector.call(this, module, id, descriptor);
	this.module = module;

	// An event input endPoint is a reference to a function of the module 
	// that will be called when an event comes in.
	var endPoint = descriptor.endPoint || '';
	var endPoint = endPoint.split('.');
	this.endPoint = module;
	for (var i = 0; i < endPoint.length; i++) {
		this.endPoint = this.endPoint[endPoint[i]];
	}
}
inherits(EventInput, Connector);
EventInput.prototype.connectorClassName = 'eventIn';
EventInput.prototype.color = EVENT_CABLE_COLOR;
EventInput.prototype.type  = 'event';
connectors.register(EventInput, 'input', 'event');

EventInput.prototype.connect = function (connector) {
	connector.connect(this);
};

EventInput.prototype.disconnect = function (connector) {
	connector.disconnect(this);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function EventOutput(module, id, descriptor) {
	Connector.call(this, module, id, descriptor);
	// event output endPoints is an array of EventInput connector references.
	this.connections = [];
}
inherits(EventOutput, Connector);
EventOutput.prototype.connectorClassName = 'eventOut';
EventOutput.prototype.color = EVENT_CABLE_COLOR;
EventOutput.prototype.type  = 'event';
connectors.register(EventOutput, 'output', 'event');

EventOutput.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	this.connections.push(connector);
};

EventOutput.prototype.disconnect = function (connector) {
	var index = this.connections.indexOf(connector);
	if (index === -1) return;
	this.connections.splice(index, 1);
};

EventOutput.prototype.emit = function (event) {
	for (var i = 0; i < this.connections.length; i++) {
		var connector = this.connections[i];
		// bind to the correct 'this' value (the connector's module)
		connector.endPoint.call(connector.module, event);
	}
};
