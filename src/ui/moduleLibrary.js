var Panel     = require('./Panel');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;

var MODULES_CONSTRUCTOR_BY_ID = {};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** ModuleLibrary
 *
 * @author Cedric Stoquer
 */
function ModuleLibrary() {
	Panel.call(this);
	this._dom.style.left = '150px'; // TODO

	this.list = createDiv('libraryList', this._dom);
}
inherits(ModuleLibrary, Panel);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.register = function (ModuleConstructor) {
	var descriptor = ModuleConstructor.prototype.descriptor;
	MODULES_CONSTRUCTOR_BY_ID[descriptor.type] = ModuleConstructor;

	// add entry in UI window
	if (!descriptor.name) return;
	var button = createDiv('libraryEntry', this.list);
	button.textContent = descriptor.name;
	button.addEventListener('mousedown', function onClick(e) {
		var module = window.moduleManager.addModule(new ModuleConstructor());
		window.moduleManager.startDrag(module, e);
	});

	// TODO: tags
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.getModuleConstructor = function (type) {
	return MODULES_CONSTRUCTOR_BY_ID[type];
};

var moduleLibrary = new ModuleLibrary();
module.exports = moduleLibrary;
