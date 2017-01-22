var connectors = require('./connectors');
var Connector  = require('./Connector');

var AUDIO_CABLE_COLOR = '#fd870e';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioInput(module, id, descriptor) {
	Connector.call(this, module, id, descriptor);
}
inherits(AudioInput, Connector);
AudioInput.prototype.connectorClassName = 'audioIn';
AudioInput.prototype.color = AUDIO_CABLE_COLOR;
AudioInput.prototype.type  = 'audio';
connectors.register(AudioInput, 'input', 'audio');

AudioInput.prototype.bind = function (module, id, descriptor) {
	var endPoint = descriptor.endPoint.split('.');
	this.endPoint = module;
	for (var i = 0; i < endPoint.length; i++) {
		this.endPoint = this.endPoint[endPoint[i]];
	}
};

AudioInput.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	connector.endPoint.connect(this.endPoint);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioOutput(module, id, descriptor) {
	Connector.call(this, module, id, descriptor);
}
inherits(AudioOutput, Connector);
AudioOutput.prototype.connectorClassName = 'audioOut';
AudioOutput.prototype.color = AUDIO_CABLE_COLOR;
AudioOutput.prototype.type  = 'audio';
connectors.register(AudioOutput, 'output', 'audio');

AudioOutput.prototype.bind = function (module, id, descriptor) {
	var endPoint = descriptor.endPoint.split('.');
	this.endPoint = module;
	for (var i = 0; i < endPoint.length; i++) {
		this.endPoint = this.endPoint[endPoint[i]];
	}
};

AudioOutput.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	this.endPoint.connect(connector.endPoint);
};

AudioOutput.prototype.disconnect = function (connector) {
	this.endPoint.disconnect(connector.endPoint);
};
