var moduleManager = require('./moduleManager');
var domUtils  = require('domUtils');
var createDiv = domUtils.createDiv;
var createDom = domUtils.createDom;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Library
 *
 * @author Cedric Stoquer
 */
function Library() {
	this.dom  = document.getElementById('library');
	this.modules = createDiv('libraryList', this.dom);
}

Library.prototype.register = function(module) {
	var button = createDiv('moduleEntry', this.modules);
	button.textContent = module.prototype.descriptor.name;
	button.addEventListener('mousedown', function clic(e) {
		moduleManager.add(new module());
	});
};

module.exports = new Library();
