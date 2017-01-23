var moduleManager = require('../core/moduleManager');
var BufferModule  = require('../core/Buffer');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var makeDragable = domUtils.makeDragable;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** BufferLibrary
 *
 * @author Cedric Stoquer
 */
function BufferLibrary() {
	this.dom = createDiv('library');

	var handle = createDiv('handle', this.dom);
	makeDragable(handle, this.dom);

	this.list = createDiv('libraryList', this.dom);

	this.createEntries();
}

BufferLibrary.prototype.createEntry = function (bufferData) {
	var button = createDiv('libraryEntry', this.list);
	button.textContent = bufferData.id;
	button.addEventListener('mousedown', function onClick(e) {
		var module = moduleManager.addModule(new BufferModule(bufferData));
		moduleManager.startDrag(module, e);
	});
};

BufferLibrary.prototype.createEntries = function () {
	var buffers = window.assets.buffers;
	for (id in buffers) {
		this.createEntry(buffers[id]);
	}
};


module.exports = new BufferLibrary();
