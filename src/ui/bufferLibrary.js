var Panel         = require('./Panel');
var moduleManager = require('./moduleManager');
var BufferModule  = require('../core/Buffer');
var domUtils      = require('domUtils');
var createDiv     = domUtils.createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** BufferLibrary
 *
 * @author Cedric Stoquer
 */
function BufferLibrary() {
	Panel.call(this);
	this.list = createDiv('libraryList', this._dom);
	this.createEntries();
}
inherits(BufferLibrary, Panel);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferLibrary.prototype.add = function (bufferData) {
	var button = createDiv('libraryEntry', this.list);
	button.textContent = bufferData.id;
	button.addEventListener('mousedown', function onClick(e) {
		var module = moduleManager.addModule(new BufferModule(bufferData));
		moduleManager.startDrag(module, e);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferLibrary.prototype.createEntries = function () {
	var buffers = window.assets.buffers;
	for (var id in buffers) {
		this.add(buffers[id]);
	}
};

module.exports = new BufferLibrary();
