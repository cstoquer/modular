var Cable         = require('../core/Cable');
var Patch         = require('../core/Patch');
var constants     = require('../core/constants');
var connectorMenu = require('./connectorMenu');
var ctx           = require('./overlay').ctx;
var overCtx       = require('./overlay').overCtx;
var domUtils      = require('domUtils');
var createDiv     = domUtils.createDiv;
var removeDom     = domUtils.removeDom;


var JACK_CONNECT_CURSOR = 'url(../img/jack-connect.png) 3 3, auto';
var JACK_FREE_CURSOR    = 'url(../img/jack-free.png) 2 3, auto';


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ModuleManager() {
	this.patch = new Patch();
	this.selectedModules = [];
	this.registerKeyEvents();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// addModule
ModuleManager.prototype.addModule = function (module, id) {
	return this.patch.addModule(module, id);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// removeCable
ModuleManager.prototype.removeCable = function (cable) {
	this.patch.removeCable(cable);
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// clearPatch
ModuleManager.prototype.clearPatch = function () {
	// deselect modules
	this.selectedModules = [];

	// clear patch
	this.patch.clearPatch();
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// getPatch
ModuleManager.prototype.getPatch = function () {
	return this.patch.getPatch();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// setPatch
ModuleManager.prototype.setPatch = function (patchData) {
	this.patch.setPatch(patchData);
	this.drawCables();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// register Key Events
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
				// t.patch._deleteMode = true;
				break;
		}
	}

	/*function keyRelease(e) {
		switch (e.keyCode) {
			case 8:
			case 46:
				t.patch._deleteMode = false;
				break;
		}
	}*/

	document.addEventListener('keydown', keyPress,   false);
	// document.addEventListener('keyup',   keyRelease, false);
};

//███████████████████████████████████████████████████████
//███████████████▄░▄█▄░▄███████▄▄░▄▄█████████████████████
//████████████████░███░██████████░███████████████████████
//████████████████░███░██████████░███████████████████████
//████████████████▄▀▀▀▄███░░███▀▀░▀▀██░░█████████████████
//███████████████████████████████████████████████████████


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.deleteSelectedModules = function () {
	var modules = this.selectedModules;
	for (var i = 0; i < modules.length; i++) {
		this.patch.removeModule(modules[i]);
	}
	this.selectedModules = [];
	this.drawCables();
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
			t.patch._addModuleInGrid(module);
			return;
		}

		// put module at position and cleanup dummy
		removeDom(dummy, null);
		var x = Math.max(0, ~~Math.round((e.clientX - startX) / constants.MODULE_WIDTH));
		var y = Math.max(1, ~~Math.round((e.clientY - startY) / constants.MODULE_HEIGHT));
		if (x === module.x && y === module.y) return;
		t.patch.moveModule(module, x, y);
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
		// TODO: why getId is on Cable prototype, can we define a static function ?
		var forwardId  = Cable.prototype.getId(targetConnector, sourceConnector);
		var backwardId = Cable.prototype.getId(sourceConnector, targetConnector);
		if (t.patch.cables[forwardId] || t.patch.cables[backwardId]) return;

		sourceConnector.connect(targetConnector);
		t.drawCables();
	}

	d.addEventListener('mousemove', move, false);
	d.addEventListener('mouseup', moveEnd, false);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.showDisconnectMenu = function (x, y, connector) {
	var cables = this.patch.findCables(connector);
	if (cables.length === 0) return;
	connectorMenu.show(x, y, connector, cables);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.drawCables = function () {
	var cables = this.patch.cables;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (var id in cables) cables[id].draw();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleManager.prototype.shakeCables = function () {
	var cables = this.patch.cables;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (var id in cables) {
		cables[id].update();
		cables[id].draw();
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var moduleManager = new ModuleManager();
module.exports = moduleManager;
window.moduleManager = moduleManager;
