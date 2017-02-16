var Panel         = require('./Panel');
var moduleManager = require('./moduleManager');
var BufferModule  = require('../core/Buffer');
var domUtils      = require('./domUtils');
var createDiv     = domUtils.createDiv;
var createDom     = domUtils.createDom;
var removeDom     = domUtils.removeDom;
var makeButton    = domUtils.makeButton;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** BufferLibrary
 *
 * @author Cedric Stoquer
 */
function BufferLibrary() {
	Panel.call(this);
	var t = this;

	// buffer list
	this.bufferDataList = [];
	this.list = createDiv('libraryList', this._dom);
	this.createEntries();

	// menu
	var menu = createDiv('', this._dom);

	this.categoryFilter = null;
	var buttons = { loop: null, shot: null, ir: null };

	function onBtnPress(e, btn) {
		if (t.categoryFilter) buttons[t.categoryFilter].style.backgroundColor = '';
		var category = btn.category;
		t.categoryFilter = t.categoryFilter === category ? null : category;
		if (t.categoryFilter) buttons[t.categoryFilter].style.backgroundColor = '#FF0';
		t.filter();
	}

	for (var category in buttons) {
		var button = createDiv('editorButton ' + category + 'Icon', menu);
		button.category = category;
		buttons[category] = button;
		makeButton(button, onBtnPress);
	}

	var addTagInput = createDom('input', 'tagInput', menu);
	

	// tag section
	this.tagSection = createDiv('bufferLibraryTags', this._dom);
	this.tags = {};

	// add new tag input
	addTagInput.onkeypress = function (e) {
		if (e.keyCode !== 13) return;
		var value = addTagInput.value;
		if (value === '') return;
		addTagInput.value = '';
		t.addTag(value);
	}
}
inherits(BufferLibrary, Panel);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferLibrary.prototype.addTag = function (tag) {
	var t = this;

	var isNot = tag[0] === '!';
	if (isNot) tag = tag.substring(1, tag.length);

	if (this.tags[tag] !== undefined) return;

	this.tags[tag] = !isNot;

	var container = createDiv('tag', this.tagSection);
	if (isNot) container.style.backgroundColor = '#da9387';
	createDiv('tagTitle', container).innerText = tag;
	var closeButton = createDiv('closeButton', container);

	// close button action
	makeButton(closeButton, function onDelete() {
		removeDom(container, t.tagSection);
		delete t.tags[tag];
		t.filter();
	});

	this.filter();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferLibrary.prototype.filter = function () {
	var tagKeys = Object.keys(this.tags);

	var loop = null;
	var ir   = false;
	if (this.categoryFilter === 'loop') loop = true;
	if (this.categoryFilter === 'shot') loop = false;
	if (this.categoryFilter === 'ir')   ir   = true;

	for (var i = 0; i < this.bufferDataList.length; i++) {
		var elem = this.bufferDataList[i];
		var buffer = elem.buffer;
		var button = elem.button;

		button.style.display = '';

		// prefilter loop, IR
		if ((loop !== null && !buffer.loop === loop) || (!buffer.ir === ir)) {
			button.style.display = 'none';
			continue;
		}

		// filter with tags
		var tags = buffer.tag || [];

		// needs all this.tags to exists in buffer.tags
		for (var j = 0; j < tagKeys.length; j++) {
			var tag = tagKeys[j];
			if ((tags.indexOf(tag) !== -1) ^ this.tags[tag]) {
				button.style.display = 'none';
				break;
			}
		}
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferLibrary.prototype.add = function (bufferData) {
	var button = createDiv('libraryEntry', this.list);
	button.textContent = bufferData.id;
	button.addEventListener('mousedown', function onClick(e) {
		var module = moduleManager.addModule(new BufferModule(bufferData));
		moduleManager.startDrag(module, e);
	});

	this.bufferDataList.push({ button: button, buffer: bufferData });
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferLibrary.prototype.createEntries = function () {
	var buffers = window.assets.buffers;
	for (var id in buffers) {
		this.add(buffers[id]);
	}
};

module.exports = new BufferLibrary();
