var connectors = require('./connectors');
var Connector  = require('./Connector');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ParamConnector(module, id, descriptor) {
	this.connections = [];
	Connector.call(this, module, id, descriptor);
}
inherits(ParamConnector, Connector);
// ParamConnector.prototype.color = '#a9ee22';
ParamConnector.prototype.color = '#2da8ff';
ParamConnector.prototype.type  = 'param';

ParamConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// save connections for rebind
	this._addConnection(connector);
	connector._addConnection(this);
};

ParamConnector.prototype.disconnect = function (connector) {
	Connector.prototype.disconnect.call(this, connector);
	// remove saved connections
	this._removeConnection(connector);
	connector._removeConnection(this);
};

ParamConnector.prototype._addConnection = function (connector) {
	this.connections.push(connector);
};

ParamConnector.prototype._removeConnection = function (connector) {
	var index = this.connections.indexOf(connector);
	if (index === -1) return; // happen to the second connector when a cable is removed
	this.connections.splice(index, 1);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ParamInput(module, id, descriptor) {
	this.endPoint = module; // redefined at bind
	ParamConnector.call(this, module, id, descriptor);
}
inherits(ParamInput, ParamConnector);
ParamInput.prototype.cssClassName = 'paramIn';
ParamInput.prototype.way = 'input';
connectors.register(ParamInput, 'input', 'param');

ParamInput.prototype.bind = function (module, id, descriptor) {
	// find endPoint reference
	var endPoint = descriptor.endPoint.split('.');
	this.endPoint = module;
	for (var i = 0; i < endPoint.length; i++) {
		this.endPoint = this.endPoint[endPoint[i]];
	}

	// reconnect previous connections if endPoint changed
	var connections = this.connections;
	this.connections = [];
	for (var i = connections.length - 1; i >= 0; i--) {
		this.connect(connections[i]);
	}
};

// AudioParam can be connected to AudioNode output
// the two following functions allow this
ParamInput.prototype.isCompatible = function (connector) {
	if (connector.type === 'audio' && connector.way === 'output') return true;
	return ParamConnector.prototype.isCompatible.call(this, connector);
};

ParamInput.prototype.connect = function (connector) {
	ParamConnector.prototype.connect.call(this, connector);
	if (connector.type === 'audio' && connector.way === 'output') {
		connector.endPoint.connect(this.endPoint);
	}
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ParamOutput(module, id, descriptor) {
	ParamConnector.call(this, module, id, descriptor);
}
inherits(ParamOutput, ParamConnector);
ParamOutput.prototype.cssClassName = 'paramOut';
ParamOutput.prototype.way = 'output';
connectors.register(ParamOutput, 'output', 'param');

ParamOutput.prototype.setAutomation = function (func) {
	var connections = this.connections;
	for (var i = 0; i < connections.length; i++) {
		func(connections[i].endPoint);
	}
};

