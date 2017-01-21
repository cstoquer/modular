var ctx       = require('./overlay').ctx;
var overCtx   = require('./overlay').overCtx;
var constants = require('./constants');
var Cable     = require('./Cable');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var createDom = domUtils.createDom;
var removeDom = domUtils.removeDom;

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
/* Add a module in the pool */
ModuleManager.prototype.add = function (module, x, y) {
	var id = this._idCount++;
	while (this.modules[this._idCount]) this._idCount++;

	module.id = id;
	this.modules[id] = module;

	this._addModuleInGrid(module, x, y);

	return module;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype._addModuleInGrid = function (module, x, y) {
	// set module position inside grid
	x = x || 0;
	y = y || 0;

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
ModuleManager.prototype.remove = function (module) {
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
		this.remove(modules[i]);
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
ModuleManager.prototype.move = function (module, x, y) {
	var row = this.grid[module.x]
	var index = row.indexOf(module);
	if (index === -1) return console.error('Module not found in grid.');
	row.splice(index, 1);
	this._addModuleInGrid(module, x, y);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.startDrag = function (module, e) {
	var t = this;
	var d = document;

	var x = module.x * constants.MODULE_WIDTH;
	var y = module.y * constants.MODULE_HEIGHT;
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

		//it was not a drag but a tap
		if (!dummy) return;

		// put module at position and cleanup dummy
		removeDom(dummy, null);
		var x = Math.max(0, ~~Math.round((e.clientX - startX) / constants.MODULE_WIDTH));
		var y = Math.max(0, ~~Math.round((e.clientY - startY) / constants.MODULE_HEIGHT));
		if (x === module.x && y === module.y) return;
		t.move(module, x, y);
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
			window.connectorMenu.show(e, sourceConnector);
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
ModuleManager.prototype.addCable = function (connectorA, connectorB, color) {
	var cable = new Cable(connectorA, connectorB, color);
	this.cables[cable.id] = cable;
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.removeCable = function (cable) {
	if (!this.cables[cable.id]) return;
	cable.disconnect();
	delete this.cables[cable.id];
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
ModuleManager.prototype.getPatch = function () {
	var patch = {
		modules: [],
		cables:  []
	};
	for (var id in this.modules) {
		patch.modules.push(this.modules[id].getState());
		// TODO
	}

	return patch;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var moduleManager = new ModuleManager();
module.exports = moduleManager;
window.moduleManager = moduleManager;

