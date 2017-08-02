var Panel        = require('../Panel');
var domUtils     = require('../domUtils');
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var removeDom    = domUtils.removeDom;
var GRID_SIZE    = require('./constants').GRID_SIZE;
var Container    = require('./Container');
var Knob         = require('./Knob');
var TextInput    = require('./TextInput');
var Label        = require('./Label');
var audioEditor  = require('../audioEditor');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function SynthEditorPanel() {
	Panel.call(this);
	var header = createDiv('synthEdit-header', this._dom);

	var self = this;

	// var updateBtn = createDiv('synthedit-button', header);
	// makeButton(updateBtn, function () {
	// 	self.updateBuffer();
	// });

	this.loopBtn = createDiv('synthedit-button', header);
	makeButton(this.loopBtn, function () {
		if (!self.bufferData) return;
		self.bufferData.loop = !self.bufferData.loop;
		// TODO: make Buffer module reemit
		self.toggleLoop();
	});

	var audioBtn = createDiv('synthedit-button', header);
	audioBtn.style.backgroundImage = 'url(../img/iconSine.png)';
	makeButton(audioBtn, function () {
		audioEditor.setBuffer(self.bufferData);
		audioEditor.open();
	});

	createDiv('synthedit-header-spacer', header);

	this.synthName = createDiv('synthedit-header-synthName', header);


	// TODO: menu
	// - synth name
	// - play/generate
	// - tags ?

	this.dom = createDiv('synthEdit-root', this._dom);

	this.bufferData = null; // the (procedural) buffer data currently edited
	
	this.close();
}
inherits(SynthEditorPanel, Panel);
module.exports = SynthEditorPanel;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.init = function (synthId, bufferData) {
	this.synthName.innerText = synthId;
	this.dom.innerHTML = '';
	// TODO: destroy (and cleanup) all components that are there

	this.bufferData = bufferData;

	// update header menu (loop, synthId)
	this.toggleLoop();


	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.updateBuffer = function () {
	var bufferData = this.bufferData;

	bufferData.generateBuffer(function () {
		// TODO: make BufferModule emit for loop samplers (only if buffer has loop on?)
		// TODO: refactor, this should belong to Buffer
		// bufferModule.$data.emit({ _type: 'buffer', buffer: bufferData.buffer });
	});
};

SynthEditorPanel.prototype.toggleLoop = function () {
	var loop = this.bufferData.loop;
	this.loopBtn.style.backgroundImage = loop ? 'url(../img/iconLoop.png)' : 'url(../img/iconShot.png)';
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
SynthEditorPanel.prototype.addTextInput = function (x, y, w) {
	var input = new TextInput(this).position(x, y, w);
	return input;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SynthEditorPanel.prototype.addLabel = function (x, y, w, text) {
	var label = new Label(this).position(x, y, w).text(text);
	return label;
};
