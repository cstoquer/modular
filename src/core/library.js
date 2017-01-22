var moduleManager = require('./moduleManager');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var makeDragable = domUtils.makeDragable;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Library
 *
 * @author Cedric Stoquer
 */
function Library() {
	this.dom = createDiv('library');

	var handle = createDiv('handle', this.dom);
	makeDragable(handle, this.dom);

	this.modules = createDiv('libraryList', this.dom);
}

Library.prototype.register = function(ModuleConstructor) {
	var button = createDiv('moduleEntry', this.modules);
	button.textContent = ModuleConstructor.prototype.descriptor.name;
	button.addEventListener('mousedown', function onClick(e) {
		var module = moduleManager.addModule(new ModuleConstructor());
		moduleManager.startDrag(module, e);
	});
};

module.exports = new Library();
