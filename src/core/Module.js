var constants     = require('./constants');
var connectors    = require('./connectors');
var moduleManager = require('./moduleManager');
var Knob          = require('./Knob');
var domUtils      = require('domUtils');
var createDiv     = domUtils.createDiv;
var createDom     = domUtils.createDom;
var removeDom     = domUtils.removeDom;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */
function Module(params) {
	params = params || {};

	this.id = null; // id of this module in moduleManager
	this.cables = {};

	var dom = createDiv('module x' + this.descriptor.size, null);
	this._title = createDom('span', '', dom);
	this._title.textContent = this.descriptor.name;
	this._dom = dom;

	for (var id in this.descriptor.inputs) {
		var input = this.descriptor.inputs[id];
		var ConnectorClass = connectors.getConnector('input', input.type);
		if (ConnectorClass) this['$' + id] = new ConnectorClass(this, id, input);
	}

	for (var id in this.descriptor.outputs) {
		var output = this.descriptor.outputs[id];
		var ConnectorClass = connectors.getConnector('output', output.type);
		if (ConnectorClass) this['$' + id] = new ConnectorClass(this, id, output);
	}

	for (var id in this.descriptor.params) {
		var control = this.descriptor.params[id];
		switch (control.type) {
			case 'knob': this['$$' + id] = new Knob(this, id, control); break;
		}
	}

	dom.module = this;

	var t = this;
	dom.addEventListener('mousedown', function mouseStart(e) {
		moduleManager.startDrag(t, e);
	});
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.descriptor = {
	name: 'Abstract Module',
	size: 1,
	inputs:  {},
	outputs: {},
	params:  {}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Set module position in UI surface */
Module.prototype.setPosition = function (x, y) {
	var style = this._dom.style;
	this.x = x;
	this.y = y;
	style.left = (constants.MODULE_WIDTH  * x) + 'px';
	style.top  = (constants.MODULE_HEIGHT * y) + 'px';

	for (id in this.cables) this.cables[id].update();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Remove module */
Module.prototype.remove = function () {
	// disconnect all connectors
	for (var id in this.cables) {
		moduleManager.removeCable(this.cables[id]);
	}
	removeDom(this._dom, null);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.addCable = function (cable) {
	this.cables[cable.id] = cable;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.removeCable = function (cable) {
	delete this.cables[cable.id];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Get module state for patch saving */
Module.prototype.getState = function () {
	var state = {
		_mod: this.constructor.name,
		id:   this.id,
		x:    this.x,
		y:    this.y
	};
	for (var id in this.descriptor.params) {
		var paramId = '$$' + id;
		state[paramId] = this[paramId].getState();
	}
	return state;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.select = function () {
	// TODO
	this._title.className = 'selected';
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.deselect = function () {
	// TODO
	this._title.className = '';
};

module.exports = Module;
