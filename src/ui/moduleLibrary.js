var moduleManager = require('../core/moduleManager');
var domUtils      = require('domUtils');
var createDiv     = domUtils.createDiv;
var makeDragable  = domUtils.makeDragable;


var MODULES_CONSTRUCTOR_BY_ID = {};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** ModuleLibrary
 *
 * @author Cedric Stoquer
 */
function ModuleLibrary() {
	this.dom = createDiv('panel');
	this.dom.style.left = '150px'; // TODO

	var handle = createDiv('handle', this.dom);
	makeDragable(handle, this.dom);

	this.list = createDiv('libraryList', this.dom);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.register = function (ModuleConstructor) {
	var descriptor = ModuleConstructor.prototype.descriptor;
	MODULES_CONSTRUCTOR_BY_ID[descriptor.type] = ModuleConstructor;

	// add entry in UI window
	if (!descriptor.name) return;
	var button = createDiv('libraryEntry', this.list);
	button.textContent = descriptor.name;
	button.addEventListener('mousedown', function onClick(e) {
		var module = moduleManager.addModule(new ModuleConstructor());
		moduleManager.startDrag(module, e);
	});

	// TODO: tags
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.getModuleConstructor = function (type) {
	return MODULES_CONSTRUCTOR_BY_ID[type];
};

var moduleLibrary = new ModuleLibrary();
module.exports = moduleLibrary;
moduleManager.moduleLibrary = moduleLibrary;
