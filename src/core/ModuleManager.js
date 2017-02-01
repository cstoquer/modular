var ctx       = require('../ui/overlay').ctx;
var overCtx   = require('../ui/overlay').overCtx;
var constants = require('./constants');
var Cable     = require('./Cable');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var createDom = domUtils.createDom;
var removeDom = domUtils.removeDom;
var connectorMenu = require('../ui/connectorMenu');

var JACK_CONNECT_CURSOR = 'url(../img/jack-connect.png) 3 3, auto';
var JACK_FREE_CURSOR    = 'url(../img/jack-free.png) 2 3, auto';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Module manager
 *
 * @author Cedric Stoquer
 */
function ModuleManager() {
	this._idCount = 0;
	this.modules = {};
	this.cables  = {};

	this.grid = [[]];

	this.selectedModules = [];

	// this._deleteMode = false;

	// external references
	this.moduleLibrary = null;

	this.registerKeyEvents();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.registerKeyEvents = function () {
	var t = this;

	function keyPress(e) {
		// e.preventDefault();
		// console.log(e.keyCode);
		switch (e.keyCode) {
			case 8:
			case 32:
				ctx.canvas.style.opacity = ctx.canvas.style.opacity ? '' : 0.4;
				break;
			case 46:
				t.deleteSelectedModules();
				// t._deleteMode = true;
				break;
		}
	}

	/*function keyRelease(e) {
		switch (e.keyCode) {
			case 8:
			case 46:
				t._deleteMode = false;
				break;
		}
	}*/

	document.addEventListener('keydown', keyPress,   false);
	// document.addEventListener('keyup',   keyRelease, false);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/* Add a module in the pool
 * @param {Module} module - the module to add
 * @param {string} [id] - module id, provided only when loading a patch
 */
ModuleManager.prototype.addModule = function (module, id) {
	if (id === undefined) {
		id = this._idCount++;
	} else if (this.modules[id]) {
		console.error('Provided id is already used.');
	}

	while (this.modules[id]) id = this._idCount++;

	module.id = id;
	this.modules[id] = module;

	// this._addModuleInGrid(module, x, y);

	return module;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype._addModuleInGrid = function (module, x, y) {
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
/** Remove a module
 *
 * @param {Object} module - module to remove
 */
ModuleManager.prototype.removeModule = function (module) {
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
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.deleteSelectedModules = function () {
	var modules = this.selectedModules;
	for (var i = 0; i < modules.length; i++) {
		this.removeModule(modules[i]);
	}
	this.selectedModules = [];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Move a module to a position (x, y)
 *
 * @param {Object} module - 
 * @param {number} x      - 
 * @param {number} y      - 
 */
ModuleManager.prototype.moveModule = function (module, x, y) {
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
ModuleManager.prototype.startDrag = function (module, e) {
	var t = this;
	var d = document;

	var x, y;
	if (module.x === null) {
		// module is not yet in the grid
		x = e.clientX - constants.MODULE_WIDTH  / 2;
		y = e.clientY - constants.MODULE_HEIGHT / 2;
	} else {
		x = module.x * constants.MODULE_WIDTH;
		y = module.y * constants.MODULE_HEIGHT;
	}

	var startX = e.clientX - x;
	var startY = e.clientY - y;

	// select module
	if (t.selectedModules.indexOf(module) === -1) {
		// unselect previous modules
		for (var i = 0; i < t.selectedModules.length; i++) {
			t.selectedModules[i].deselect();
		}

		// select this module
		t.selectedModules = [module];
		module.select();
	}

	function createDummy(module) {
		var x = module.x * constants.MODULE_WIDTH;
		var y = module.y * constants.MODULE_HEIGHT;
		var dummy = createDiv('dummy', null);
		dummy.style.width  = (constants.MODULE_WIDTH - 10) + 'px';
		dummy.style.height = (module.descriptor.size * constants.MODULE_HEIGHT - 10) + 'px';
		dummy.style.left   = x + 'px';
		dummy.style.top    = y + 'px';
		return dummy;
	}

	// TODO: allow draging several selected modules at once
	var dummy = null;

	function dragMove(e) {
		e.preventDefault();
		var x = e.clientX;
		var y = e.clientY;
		if (Math.abs(x - startX) < 4 && Math.abs(x - startX) < 4) return;
		// start dragging
		if (!dummy) dummy = createDummy(module);
		dummy.style.left = x - startX + 'px';
		dummy.style.top  = y - startY + 'px';
	}

	function dragEnd(e) {
		e.preventDefault();
		d.removeEventListener('mouseup', dragEnd);
		d.removeEventListener('mousemove', dragMove);

		//it was not a drag but a tap, and the module was already in the grid
		if (!dummy && module.x !== null) return;

		// it's a tap, but the module is not in the grid yet
		if (!dummy) {
			t._addModuleInGrid(module);
			return;
		}

		// put module at position and cleanup dummy
		removeDom(dummy, null);
		var x = Math.max(0, ~~Math.round((e.clientX - startX) / constants.MODULE_WIDTH));
		var y = Math.max(1, ~~Math.round((e.clientY - startY) / constants.MODULE_HEIGHT));
		if (x === module.x && y === module.y) return;
		t.moveModule(module, x, y);
		t.drawCables();
	}

	d.addEventListener('mousemove', dragMove, false);
	d.addEventListener('mouseup', dragEnd, false);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startConnection = function (sourceConnector, e) {
	var t = this;
	var d = document;

	var mouseX = e.clientX;
	var mouseY = e.clientY;

	var startX = sourceConnector.module.x * constants.MODULE_WIDTH  + sourceConnector.x * constants.CONNECTOR_GRID_SIZE + 8;
	var startY = sourceConnector.module.y * constants.MODULE_HEIGHT + sourceConnector.y * constants.CONNECTOR_GRID_SIZE + 8;

	drag = false;

	function move(e) {
		var x = e.clientX;
		var y = e.clientY;
		e.preventDefault();
		if (!drag && Math.abs(x - mouseX) < 4 && Math.abs(y - mouseY) < 4) return;
		drag = true;

		// draw a line on overlay
		overCtx.clearRect(0, 0, overCtx.canvas.width, overCtx.canvas.height);
		overCtx.beginPath();
		overCtx.moveTo(startX, startY);
		overCtx.lineTo(x, y);
		overCtx.stroke();

		// check if there is a compatible connector under pointer
		var dom = d.elementFromPoint(x, y);
		var targetConnector = dom && dom.connector;
		if (targetConnector && targetConnector.isCompatible && targetConnector.isCompatible(sourceConnector)) {
			document.body.style.cursor = JACK_CONNECT_CURSOR;
		} else {
			document.body.style.cursor = JACK_FREE_CURSOR;
		}
	}

	function moveEnd(e) {
		e.preventDefault();
		d.removeEventListener('mouseup', moveEnd);
		d.removeEventListener('mousemove', move);
		document.body.style.cursor = '';
		overCtx.clearRect(0, 0, overCtx.canvas.width, overCtx.canvas.height);

		if (!drag) {
			// open menu with disconnection option
			t.showDisconnectMenu(e.clientX, e.clientY, sourceConnector);
			return;
		}

		var dom = d.elementFromPoint(e.clientX, e.clientY);
		var targetConnector = dom.connector;
		if (!targetConnector) return;

		// check that connection is valid
		if (targetConnector === sourceConnector) return;
		if (targetConnector && targetConnector.isCompatible && !targetConnector.isCompatible(sourceConnector)) return;

		// check that connection don't already exist
		var forwardId  = Cable.prototype.getId(targetConnector, sourceConnector);
		var backwardId = Cable.prototype.getId(sourceConnector, targetConnector);
		if (t.cables[forwardId] || t.cables[backwardId]) return;

		sourceConnector.connect(targetConnector);
	}

	d.addEventListener('mousemove', move, false);
	d.addEventListener('mouseup', moveEnd, false);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.showDisconnectMenu = function (x, y, connector) {
	var cables = this.findCables(connector);
	if (cables.length === 0) return;
	connectorMenu.show(x, y, connector, cables);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.disconnect = function (connector) {
	var cables = this.findCables(connector);
	for (var i = 0; i < cables.length; i++) {
		this.removeCable(cables[i]);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Find all the cables that connect to a particular connector */
ModuleManager.prototype.findCables = function (connector) {
	var key = connector.module.id + ':' + connector.id;
	var cables = [];
	for (var cableId in this.cables) {
		var ids = cableId.split('--');
		if (ids[0] === key || ids[1] === key) cables.push(this.cables[cableId]);
	}
	return cables;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.areConnected = function (connectorA, connectorB) {
	var keyA = connectorA.module.id + ':' + connectorA.id;
	var keyB = connectorB.module.id + ':' + connectorB.id;
	return this.cables[keyA + '--' + keyB] || this.cables[keyB + '--' + keyA];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.addCable = function (connectorA, connectorB, color) {
	// check if this cable doesn't exist already
	if (this.areConnected(connectorA, connectorB)) return;

	// add the new cable
	var cable = new Cable(connectorA, connectorB, color);
	this.cables[cable.id] = cable;
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.removeCable = function (cable) {
	if (!this.cables[cable.id]) return;
	cable.disconnect();
	delete this.cables[cable.id];
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.drawCables = function () {
	var cables = this.cables;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (var id in cables) cables[id].draw();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.shakeCables = function () {
	var cables = this.cables;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (var id in cables) {
		cables[id].update();
		cables[id].draw();
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Removes everything, modules, cables, etc. and leave a blank patch */
ModuleManager.prototype.clearPatch = function () {
	// deselect modules
	this.selectedModules = [];

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
ModuleManager.prototype.getPatch = function () {
	var patch = {
		_type: 'modularPatch',
		version: 1,
		modules: [],
		cables:  []
	};

	for (var id in this.modules) {
		patch.modules.push(this.modules[id].getState());
	}

	for (var id in this.cables) {
		patch.cables.push(id);
	}

	return patch;
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
// TODO: register system for data types
var DATA_MAP = {
	BufferData:       require('../data/BufferData'),
	ProceduralBuffer: require('../data/ProceduralBuffer')
};

function deserialize(data) {
	var type = data._type;
	if (!type) return data;
	var DataType = DATA_MAP[type];
	if (!DataType) return data;
	return DataType.deserialize(data);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.setPatch = function (patch) {
	if (!patch || !patch._type === 'modularPatch') return console.error('Wrong format');
	this.clearPatch();

	// Add all modules
	var modules = patch.modules || [];
	for (var i = 0; i < modules.length; i++) {
		var moduleDef = modules[i];
		var ModuleConstructor = this.moduleLibrary.getModuleConstructor(moduleDef._type);
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
	var cables = patch.cables || [];

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
var moduleManager = new ModuleManager();
module.exports = moduleManager;
window.moduleManager = moduleManager;
