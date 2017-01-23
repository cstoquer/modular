var connectors = require('./connectors');
var Connector  = require('./Connector');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioConnector(module, id, descriptor) {
	this.connections = [];
	Connector.call(this, module, id, descriptor);
}
inherits(AudioConnector, Connector);
AudioConnector.prototype.color = '#fd870e';
AudioConnector.prototype.type  = 'audio';

AudioConnector.prototype.bind = function (module, id, descriptor) {
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

AudioConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// save connections for rebind
	this._addConnection(connector);
	connector._addConnection(this);
};

AudioConnector.prototype.disconnect = function (connector) {
	Connector.prototype.disconnect.call(this, connector);
	// remove saved connections
	this._removeConnection(connector);
	connector._removeConnection(this);
};

AudioConnector.prototype._addConnection = function (connector) {
	this.connections.push(connector);
};

AudioConnector.prototype._removeConnection = function (connector) {
	var index = this.connections.indexOf(connector);
	if (index === -1) return; // happen to the second connector when a cable is removed
	this.connections.splice(index, 1);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioInput(module, id, descriptor) {
	AudioConnector.call(this, module, id, descriptor);
}
inherits(AudioInput, AudioConnector);
AudioInput.prototype.cssClassName = 'audioIn';
AudioInput.prototype.way = 'input';
connectors.register(AudioInput, 'input', 'audio');

AudioInput.prototype.connect = function (connector) {
	AudioConnector.prototype.connect.call(this, connector);
	connector.endPoint.connect(this.endPoint);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioOutput(module, id, descriptor) {
	AudioConnector.call(this, module, id, descriptor);
}
inherits(AudioOutput, AudioConnector);
AudioOutput.prototype.cssClassName = 'audioOut';
AudioOutput.prototype.way = 'output';
connectors.register(AudioOutput, 'output', 'audio');

AudioOutput.prototype.connect = function (connector) {
	AudioConnector.prototype.connect.call(this, connector);
	this.endPoint.connect(connector.endPoint);
};

AudioOutput.prototype.disconnect = function (connector) {
	AudioConnector.prototype.disconnect.call(this, connector);
	this.endPoint.disconnect(connector.endPoint);
};
