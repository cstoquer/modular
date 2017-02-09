var Cable = require('./Cable');
var moduleLibrary = require('./modules');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TODO: register system for data types
var DATA_MAP = {
	BufferData:       require('../data/BufferData'),
	ProceduralBuffer: require('../data/ProceduralBuffer')
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Patch
 *
 * @author Cedric Stoquer
 */
function Patch() {
	this._idCount = 0;
	this.modules  = {};
	this.cables   = {};
	this.grid     = [[]];
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* Add a module in the pool
 * @param {Module} module - the module to add
 * @param {string} [id] - module id, provided only when loading a patch
 */
Patch.prototype.addModule = function (module, id) {
	if (id === undefined) {
		id = this._idCount++;
	} else if (this.modules[id]) {
		console.error('Provided id is already used.');
	}

	while (this.modules[id]) id = this._idCount++;

	module.id = id;
	module.patch = this;
	this.modules[id] = module;

	// this._addModuleInGrid(module, x, y);

	return module;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Remove a module
 *
 * @param {Object} module - module to remove
 */
Patch.prototype.removeModule = function (module) {
	delete this.modules[module.id];
	if (module.id < this._idCount) this._idCount = module.id;

	function removeFromArray(array) {
		var index = array.indexOf(module);
		if (index === -1) return console.error('Module not found.');
		array.splice(index, 1);
	}

	// remove UI object from grid and html
	removeFromArray(this.grid[module.x]);
	module.remove();

	// redraw cable to remove deleted ones
	// this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype.disconnect = function (connector) {
	var cables = this.findCables(connector);
	for (var i = 0; i < cables.length; i++) {
		this.removeCable(cables[i]);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Find all the cables that connect to a particular connector */
Patch.prototype.findCables = function (connector) {
	var key = connector.module.id + ':' + connector.id;
	var cables = [];
	for (var cableId in this.cables) {
		var ids = cableId.split('--');
		if (ids[0] === key || ids[1] === key) cables.push(this.cables[cableId]);
	}
	return cables;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype.areConnected = function (connectorA, connectorB) {
	var keyA = connectorA.module.id + ':' + connectorA.id;
	var keyB = connectorB.module.id + ':' + connectorB.id;
	return this.cables[keyA + '--' + keyB] || this.cables[keyB + '--' + keyA];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype.addCable = function (connectorA, connectorB, color) {
	// check if this cable doesn't exist already
	if (this.areConnected(connectorA, connectorB)) return;

	// add the new cable
	var cable = new Cable(connectorA, connectorB, color);
	this.cables[cable.id] = cable;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype.removeCable = function (cable) {
	if (!this.cables[cable.id]) return;
	cable.disconnect();
	delete this.cables[cable.id];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Removes everything, modules, cables, etc. and leave a blank patch */
Patch.prototype.clearPatch = function () {
	// disconnect everything
	for (var id in this.cables) {
		this.removeCable(this.cables[id]);
	}

	// remove all modules
	for (var id in this.modules) {
		this.removeModule(this.modules[id]);
	}

	// reset module id counter
	this._idCount = 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype.getPatch = function () {
	var patchData = {
		_type: 'modularPatch',
		version: 1,
		modules: [],
		cables:  []
	};

	for (var id in this.modules) {
		patchData.modules.push(this.modules[id].getState());
	}

	for (var id in this.cables) {
		patchData.cables.push(id);
	}

	return patchData;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** helper function to create a new instance of a Class with arbitrary arguments */
function construct(constructor, args) {
    function Module() {
        return constructor.apply(this, args);
    }
    Module.prototype = constructor.prototype;
    // TODO: also modify the constructor name
    return new Module();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function deserialize(data) {
	var type = data._type;
	if (!type) return data;
	var DataType = DATA_MAP[type];
	if (!DataType) return data;
	return DataType.deserialize(data);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype.setPatch = function (patchData) {
	if (!patchData || !patchData._type === 'modularPatch') return console.error('Wrong format');
	this.clearPatch();

	// Add all modules
	var modules = patchData.modules || [];
	for (var i = 0; i < modules.length; i++) {
		var moduleDef = modules[i];
		var ModuleConstructor = moduleLibrary.getModuleConstructor(moduleDef._type);
		if (!ModuleConstructor) {
			console.error('Could not create module of type', moduleDef._type);
			continue;
		}

		var module;
		if (moduleDef.arguments) {
			// deserialize arguments
			var args = moduleDef.arguments;
			for (var a = 0; a < args.length; a++) {
				args[a] = deserialize(args[a]);
			}
			// create module
			module = construct(ModuleConstructor, args);
		} else {
			module = new ModuleConstructor();
		}

		this.addModule(module, moduleDef.id);
		this._addModuleInGrid(module, moduleDef.x, moduleDef.y);

		module.setState(moduleDef);
	}

	// Add cables
	var cables = patchData.cables || [];

	for (var i = 0; i < cables.length; i++) {
		var cable = cables[i];
		connections = cable.split('--');

		connectionA = connections[0].split(':');
		connectionB = connections[1].split(':');

		moduleA = this.modules[connectionA[0]];
		moduleB = this.modules[connectionB[0]];

		connectorA = moduleA['$' + connectionA[1]];
		connectorB = moduleB['$' + connectionB[1]];

		connectorA.connect(connectorB);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Patch.prototype._addModuleInGrid = function (module, x, y) {
	// set module position inside grid
	x = x || 0;
	y = y || 1;

	if (!this.grid[x]) this.grid[x] = [];
	var row = this.grid[x];
	var size = module.descriptor.size;

	// move y cursor to next available position
	var index = 0;
	var pos = y;
	for (; index < row.length; index++) {
		var m = row[index];
		if (m.y < y && m.y + m.descriptor.size >= y) {
			pos = m.y + m.descriptor.size;
			index++;
			break;
		} else if (m.y >= y) {
			break;
		}
	}

	// insert module
	module.setPosition(x, pos);
	row.splice(index, 0, module);
	pos += module.descriptor.size;

	// move all modules below if needed
	for (var i = index + 1; i < row.length; i++) {
		var m = row[i];
		if (m.y >= pos) break;
		m.setPosition(m.x, pos);
		pos += m.descriptor.size;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Move a module to a position (x, y)
 *
 * @param {Object} module - 
 * @param {number} x      - 
 * @param {number} y      - 
 */
Patch.prototype.moveModule = function (module, x, y) {
	// check if module is already in grid
	if (module.x !== null) {
		// remove module from grid
		var row = this.grid[module.x]
		var index = row.indexOf(module);
		if (index === -1) return console.error('Module not found in grid.');
		row.splice(index, 1);
	}
	// add back in the grid at new its position
	this._addModuleInGrid(module, x, y);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
module.exports = Patch;
