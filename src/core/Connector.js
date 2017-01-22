var moduleManager = require('./moduleManager');
var connectors    = require('./connectors');
var constants     = require('./constants');
var createDiv     = require('domUtils').createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Connector Abstract class
 *
 * @author Cedric Stoquer
 */
function Connector(module, id, descriptor) {
	var t = this;
	this.x = descriptor.x;
	this.y = descriptor.y;

	this.module = module;
	this.id     = id;

	var dom = this._dom = createDiv('connector ' + this.connectorClassName, module._dom);
	if (descriptor.label) createDiv('label connectorLabel', dom).innerText = descriptor.label;

	if (this.x === undefined) {
		// TODO: remove this
		dom.style.position = 'relative'
	} else {
		dom.style.left = (this.x * constants.CONNECTOR_GRID_SIZE + 1) + 'px';
		dom.style.top  = (this.y * constants.CONNECTOR_GRID_SIZE + 1) + 'px';
	}

	dom.connector = this;

	dom.addEventListener('mousedown', function mouseStart(e) {
		e.stopPropagation();
		e.preventDefault();
		moduleManager.startConnection(t, e);
	});

	this.bind(module, id, descriptor);
}
module.exports = Connector;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Connector.prototype.connectorClassName = 'connector'; // cssClassName
Connector.prototype.color = '#2da8ff';
Connector.prototype.type  = 'none';
connectors.register(Connector, 'input', 'none');
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Connector.prototype.bind = function (module, id, descriptor) {
	/* virtual */
};

Connector.prototype.connect = function (connector) {
	moduleManager.addCable(this, connector, this.color);
};

Connector.prototype.disconnect = function (connector) {
	/* virtual */
};

Connector.prototype.isCompatible = function (connector) {
	if (connector === this) return false;
	if (this.type !== connector.type) return false;
	return true;
};
