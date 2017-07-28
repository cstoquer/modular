var Panel      = require('./Panel');
var categories = require('../core/moduleCategories');
var modules    = require('../core/modules');
var domUtils   = require('./domUtils');
var makeButton = domUtils.makeButton;
var createDiv  = domUtils.createDiv;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** ModuleLibrary
 *
 * @author Cedric Stoquer
 */
function ModuleLibrary() {
	Panel.call(this);
	this._dom.style.left = '150px'; // TODO

	this.current    = null; // currently opened id
	this.tabs       = {}; // map of tabs by id
	this.lists      = {}; // map of list by tab id
	this.tabHolder  = createDiv('libraryTabHolder',  this._dom);
	this.listHolder = createDiv('libraryListHolder', this._dom);
	// this.list      = createDiv('libraryList', this._dom);

	// create tabs from categories
	for (var category in categories) {
		this.addTab(categories[category]);
	}

	this.addEntries(modules.getList());
}
inherits(ModuleLibrary, Panel);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.addTab = function (id) {
	if (this.tabs[id]) return this.tabs[id];
	var tab  = createDiv('libraryTab',  this.tabHolder);
	var list = createDiv('libraryList', this.listHolder);
	list.style.display = 'none';

	tab.innerText = id;

	this.tabs[id]  = tab;
	this.lists[id] = list;

	if (!this.current) this.selectTab(id);

	var self = this;
	makeButton(tab, function onClick() {
		self.selectTab(id);
	});

	return tab;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.selectTab = function (id) {
	if (this.current === id) return;

	if (this.current) {
		this.lists[this.current].style.display = 'none';
		this.tabs[this.current].style.backgroundColor = '';
	}

	this.current = id;
	this.lists[id].style.display = '';
	this.tabs[this.current].style.backgroundColor = '#FF0';
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.addEntries = function (library) {
	for (var id in library) {
		this.addEntry(library[id]);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ModuleLibrary.prototype.addEntry = function (ModuleConstructor) {
	var descriptor = ModuleConstructor.prototype.descriptor;
	var category   = descriptor._category;

	if (!descriptor.name) return;

	// add entry in UI window
	var list = this.lists[category];
	if (!list) {
		// TODO
		return console.error('category is not registered');
	}

	var button = createDiv('libraryEntry', list);
	button.textContent = descriptor.name;
	button.addEventListener('mousedown', function onClick(e) {
		var module = window.moduleManager.addModule(new ModuleConstructor());
		window.moduleManager.startDrag(module, e);
	});

	// TODO: tags
};

var moduleLibrary = new ModuleLibrary();
module.exports = moduleLibrary;
