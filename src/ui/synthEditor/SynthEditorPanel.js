var Panel        = require('../Panel');
var domUtils     = require('../domUtils');
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var removeDom    = domUtils.removeDom;
var GRID_SIZE    = require('./constants').GRID_SIZE;
var Container    = require('./Container');
var Knob         = require('./Knob');
var Label        = require('./Label');
var audioEditor  = require('../audioEditor');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function SynthEditorPanel() {
	Panel.call(this);
	var header = createDiv('synthEdit-header', this._dom);

	var self = this;

	// TODO: auto update when a modification is done
	var updateBtn = createDiv('synthedit-button', header);
	makeButton(updateBtn, function () {
		self.updateBuffer();
	});

	var audioBtn = createDiv('synthedit-button', header);
	makeButton(audioBtn, function () {
		audioEditor.setBuffer(self.bufferData);
		audioEditor.open();
	});


	// TODO: menu
	// - synth name
	// - loop toggle
	// - play/generate
	// - open audio editor
	// - tags ?

	this.dom = createDiv('synthEdit-root', this._dom);

	this.bufferData = null; // the (procedural) buffer data currently edited
	
	this.close();
}
inherits(SynthEditorPanel, Panel);
module.exports = SynthEditorPanel;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.init = function (synthId, bufferData) {
	this.dom.innerHTML = '';
	// TODO: destroy (and cleanup) all components that are there

	this.bufferData = bufferData;

	// TODO update header menu (loop, synthId)
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.updateBuffer = function () {
	var bufferData = this.bufferData;

	bufferData.generateBuffer(function () {
		// TODO: make BufferModule emit
		// TODO: refactor, this should belong to Buffer
		// bufferModule.$data.emit({ _type: 'buffer', buffer: bufferData.buffer });
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.resize = function (w, h) {
	this.dom.style.width  = w * GRID_SIZE + 'px';
	this.dom.style.height = h * GRID_SIZE + 'px';
	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.addContainer = function (x, y, w, h) {
	var container = new Container(this).rect(x, y, w, h);
	// TODO: keep reference
	return container;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.addKnob = function (x, y) {
	var knob = new Knob(this).position(x, y);
	return knob;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.addLabel = function (x, y, w, text) {
	var label = new Label(this).position(x, y, w).text(text);
	return label;
};
