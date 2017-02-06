var Panel         = require('./Panel');
var moduleManager = require('./moduleManager');
var BufferModule  = require('../core/Buffer');
var domUtils      = require('domUtils');
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

	// buffer list
	this.bufferDataList = [];
	this.list = createDiv('libraryList bufferLibrary', this._dom);
	this.createEntries();

	// menu
	var menu = createDiv('', this._dom);
	var loopBtn = createDiv('editorButton loopIcon', menu);
	var shotBtn = createDiv('editorButton shotIcon', menu);
	var irBtn   = createDiv('editorButton irIcon', menu);
	var addTagInput = createDom('input', 'tagInput', menu);

	// tag section
	this.tagSection = createDiv('bufferLibraryTags', this._dom);
	this.tags = {};

	// add new tag input
	var t = this;
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
	var tagKeys = Object.keys(this.tags)

	// remove all filters
	for (var i = 0; i < this.bufferDataList.length; i++) {
		this.bufferDataList[i].button.style.display = '';
	}

	// TODO: prefilter loop, IR

	if (tagKeys.length !== 0) {
		// filter with tags
		for (var i = 0; i < this.bufferDataList.length; i++) {
			var elem = this.bufferDataList[i];
			var tags = elem.buffer.tag || [];
			// needs all this.tags to exists in buffer.tags
			for (var j = 0; j < tagKeys.length; j++) {
				var tag = tagKeys[j];
				var compare = this.tags[tag]; 
				if ((tags.indexOf(tag) !== -1) ^ compare) {
					elem.button.style.display = 'none';
					continue;
				}
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
