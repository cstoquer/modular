var Panel     = require('./Panel');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;

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
ModuleLibrary.prototype.addEntries = function (library) {
	for (var id in library) {
		this.addEntry(library[id]);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.addEntry = function (ModuleConstructor) {
	var descriptor = ModuleConstructor.prototype.descriptor;

	if (!descriptor.name) return;

	// add entry in UI window
	var button = createDiv('libraryEntry', this.list);
	button.textContent = descriptor.name;
	button.addEventListener('mousedown', function onClick(e) {
		var module = window.moduleManager.addModule(new ModuleConstructor());
		window.moduleManager.startDrag(module, e);
	});

	// TODO: tags
};

var moduleLibrary = new ModuleLibrary();
module.exports = moduleLibrary;
