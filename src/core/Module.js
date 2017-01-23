var domUtils      = require('domUtils');
var createDiv     = domUtils.createDiv;
var createDom     = domUtils.createDom;
var removeDom     = domUtils.removeDom;
var constants     = require('./constants');
var connectors    = require('./connectors');
var moduleManager = require('./moduleManager');

var CONTROL_BY_TYPE = {
	knob:   require('./Knob'),
	button: require('./Button')
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Main abstract class for modules. Handle UI display.
 *
 * @author Cedric Stoquer
 */
function Module() {
	this.id = null; // id of this module in moduleManager
	this.x  = null;
	this.y  = null;
	this.cables = {};

	var dom = createDiv('module x' + this.descriptor.size, null);
	this._title = createDom('span', '', dom);
	this._title.textContent = this.descriptor.name;
	this._dom = dom;
	dom.style.left = (-10 - constants.MODULE_WIDTH) + 'px';

	this.createInterface();

	dom.module = this;

	var t = this;
	dom.addEventListener('mousedown', function mouseStart(e) {
		moduleManager.startDrag(t, e);
	});

	// if any, keep constructor arguments for serialization
	if (arguments.length) {
		this._arguments = [];
		for (var i = 0; i < arguments.length; i++) {
			var argument = arguments[i];
			if (argument.serialize) {
				this._arguments.push(argument.serialize());
			} else {
				this._arguments.push(argument);
			}
		}
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.descriptor = {
	// type:     'type',   // Type of the module for serialization. It should be an unique id 
	// name:     'name',   // How the module appears in the library UI. if null, it won't be registered
	// size:     1,        // Height of the module in rack units (see constants.MODULE_HEIGHT)
	// inputs:   {},       // List of input connectors.  An input  `id` is added as a property `$id`
	// outputs:  {},       // List of output connectors. An output `id` is added as a property `$id`
	// controls: {},       // List of controls (Knob, Buttons, etc.) see CONTROL_BY_TYPE
	// persistent: []      // List of persistent data that has to be saved during module serialization.
	// tag:        []      // List of tags. Used for filter and search in library
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.createInterface = function () {
	if (this.descriptor.inputs) {
		for (var id in this.descriptor.inputs) {
			var input = this.descriptor.inputs[id];
			var ConnectorClass = connectors.getConnector('input', input.type);
			if (ConnectorClass) this['$' + id] = new ConnectorClass(this, id, input);
		}
	}

	if (this.descriptor.outputs) {
		for (var id in this.descriptor.outputs) {
			var output = this.descriptor.outputs[id];
			var ConnectorClass = connectors.getConnector('output', output.type);
			if (ConnectorClass) this['$' + id] = new ConnectorClass(this, id, output);
		}
	}

	if (this.descriptor.controls) {
		for (var id in this.descriptor.controls) {
			var controlDescriptor = this.descriptor.controls[id];
			var controlClass = CONTROL_BY_TYPE[controlDescriptor.type];
			this['$$' + id] = new controlClass(this, id, controlDescriptor);
		}
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.rebind = function () {
	if (this.descriptor.inputs) {
		for (var id in this.descriptor.inputs) {
			if (this['$' + id]) this['$' + id].bind(this, id, this.descriptor.inputs[id]);
		}
	}

	if (this.descriptor.outputs) {
		for (var id in this.descriptor.outputs) {
			if (this['$' + id]) this['$' + id].bind(this, id, this.descriptor.outputs[id]);
		}
	}

	if (this.descriptor.controls) {
		for (var id in this.descriptor.controls) {
			if (this['$$' + id]) this['$$' + id].bind(this, id, this.descriptor.controls[id]);
		}
	}
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
		_type: this.descriptor.type,
		id:    this.id,
		x:     this.x,
		y:     this.y
	};

	// constructor arguments
	if (this._arguments) {
		state.arguments = this._arguments;
	}

	// controls (Knob, etc.)
	if (this.descriptor.controls) {
		state.controls = {};
		for (var id in this.descriptor.controls) {
			if (!this['$$' + id].getState) continue;
			state.controls[id] = this['$$' + id].getState();
		}
	}

	// persistent data (e.g. Filter type)
	var persistent = this.descriptor.persistent;
	if (persistent) {
		state.persistent = [];
		for (var i = 0; i < persistent.length; i++) {
			state.persistent.push(this[persistent[i]]);
		}
	}

	return state;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.setState = function (state) {
	// controls
	if (state.controls) {
		for (var id in this.descriptor.controls) {
			if (!state.controls[id]) continue;
			this['$$' + id].setState(state.controls[id]);
		}
	}

	// persistent data
	if (state.persistent) {
		for (var i = 0; i < this.descriptor.persistent.length; i++) {
			var id = this.descriptor.persistent[i];
			// TODO: persistent of type 'something.thing'
			this[id] = state.persistent[i];
		}
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.select = function () {
	this._title.className = 'selected';
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Module.prototype.deselect = function () {
	this._title.className = '';
};

module.exports = Module;
