var moduleManager = require('../core/moduleManager');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var makeDragable = domUtils.makeDragable;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** ModuleLibrary
 *
 * @author Cedric Stoquer
 */
function ModuleLibrary() {
	this.dom = createDiv('library');

	var handle = createDiv('handle', this.dom);
	makeDragable(handle, this.dom);

	this.list = createDiv('libraryList', this.dom);
}

ModuleLibrary.prototype.register = function (ModuleConstructor) {
	var button = createDiv('libraryEntry', this.list);
	button.textContent = ModuleConstructor.prototype.descriptor.name;
	button.addEventListener('mousedown', function onClick(e) {
		var module = moduleManager.addModule(new ModuleConstructor());
		moduleManager.startDrag(module, e);
	});
};

module.exports = new ModuleLibrary();
