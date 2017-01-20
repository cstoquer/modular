var domUtils     = require('domUtils');
var audioContext = require('./core/audioContext');
var connectors   = require('./core/connectors');
var Connector    = require('./core/Connector');
var ROOT         = require('./core/root');

// remove pixelbox canvas
domUtils.removeDom($screen.canvas, document.body);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function loadData(path, cb) {
	var xobj = new XMLHttpRequest();
	xobj.responseType = 'arraybuffer';

	xobj.onreadystatechange = function onXhrStateChange() {
		if (~~xobj.readyState !== 4) return;
		if (~~xobj.status !== 200 && ~~xobj.status !== 0) {
			return cb('xhrError:' + xobj.status);
		}
		return cb(null, xobj.response);
	};

	xobj.open('GET', path, true);
	xobj.send();
}

function loadAudioBuffer(path, cb) {
	loadData(path, function (error, buffer) {
		if (error) return cb(error);
		audioContext.decodeAudioData(buffer, function onSuccess(buffer) {
			return cb(null, buffer);
		}, cb);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var AUDIO_CABLE_COLOR = '#fd870e';

function AudioInConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);
	var endPoint = connectorDescription.endPoint.split('.');
	this.endPoint = module;
	for (var i = 0; i < endPoint.length; i++) {
		this.endPoint = this.endPoint[endPoint[i]];
	}
}
inherits(AudioInConnector, Connector);
AudioInConnector.prototype.connectorClassName = 'audioIn';
AudioInConnector.prototype.color = AUDIO_CABLE_COLOR;
connectors.register(AudioInConnector, 'input', 'audio');

AudioInConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	connector.endPoint.connect(this.endPoint);
};

AudioInConnector.prototype.disconnect = function (connector) {
	try {
		connector.endPoint.disconnect(this.endPoint);
	} catch (e) {

	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function AudioOutConnector(module, id, connectorDescription) {
	Connector.call(this, module, id, connectorDescription);
	var endPoint = connectorDescription.endPoint.split('.');
	this.endPoint = module;
	for (var i = 0; i < endPoint.length; i++) {
		this.endPoint = this.endPoint[endPoint[i]];
	}
}
inherits(AudioOutConnector, Connector);
AudioOutConnector.prototype.connectorClassName = 'audioOut';
AudioOutConnector.prototype.color = AUDIO_CABLE_COLOR;
connectors.register(AudioOutConnector, 'output', 'audio');

AudioOutConnector.prototype.connect = function (connector) {
	Connector.prototype.connect.call(this, connector);
	// TODO: check connector type
	// TODO: enable to be connected to another inEvent for daisy chain
	this.endPoint.connect(connector.endPoint);
};

AudioOutConnector.prototype.disconnect = function (connector) {
	try {
		this.endPoint.disconnect(connector.endPoint);
	} catch (e) {

	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
require('./modules/TestModule');
require('./modules/Oscillator');
require('./modules/LFO');
require('./modules/Gain');
require('./modules/Panner');
require('./modules/ModPanner');
require('./modules/Context');



//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
