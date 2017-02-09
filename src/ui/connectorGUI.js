var Connector = require('../core/Connector');
var constants = require('./constants');
var createDiv = require('domUtils').createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Connector.prototype.initGUI = function (module, id, descriptor) {
	var dom = this._dom = createDiv('connector ' + this.cssClassName, module._dom);
	if (descriptor.label) createDiv('label connectorLabel', dom).innerText = descriptor.label;

	if (this.x === undefined) {
		// TODO: remove this
		dom.style.position = 'relative'
	} else {
		dom.style.left = (this.x * constants.CONNECTOR_GRID_SIZE + 1) + 'px';
		dom.style.top  = (this.y * constants.CONNECTOR_GRID_SIZE + 1) + 'px';
	}

	dom.connector = this;

	var t = this;
	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();
		window.moduleManager.startConnection(t, e);
	});
};