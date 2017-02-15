var assetLoader  = require('./assetLoader');
var Panel        = require('./Panel');
var beforeClose  = require('./beforeClose');
var domUtils     = require('domUtils');
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
var removeDom    = domUtils.removeDom;
var makeDragable = domUtils.makeDragable;

var WAVEFORM_WIDTH  = 600;
var WAVEFORM_HEIGHT = 200;
var HALF_HEIGHT     = ~~(WAVEFORM_HEIGHT / 2);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** AudioEditor
 *
 * @author Cedric Stoquer
 */
function AudioEditor() {
	Panel.call(this);
	var t = this;

	this.close();

	// waveform view properties
	this.zoom   = 1; // a percentage of the portion in view : ]0,1]
	this.offset = 0; // sample offsets : [0, bufferLength*(1-zoom)]
	this.bufferData = null;

	this.canSave = false;

	// dom elements
	this.scroll = createDiv('hscroll', this._dom);
	this.scroll.style.width = WAVEFORM_WIDTH + 'px';

	this.scrollContent = createDiv('', this.scroll);
	this.scrollContent.style.width = ~~(WAVEFORM_WIDTH / this.zoom) + 'px';
	this.scrollContent.style.height = '2px';


	this.scroll.addEventListener('scroll', function () {
		t.onScroll();
	});

	// waveform canvas
	this.canvas = createDom('canvas', 'waveformCanvas', this._dom);
	this.canvas.width  = WAVEFORM_WIDTH;
	this.canvas.height = WAVEFORM_HEIGHT;
	this.canvas.style.width  = WAVEFORM_WIDTH  + 'px';
	this.canvas.style.height = WAVEFORM_HEIGHT + 'px';
	this.canvas.style.marginTop = '2px';

	this.ctx = this.canvas.getContext('2d');

	this.canvas.addEventListener('wheel', function (e) {
		t.onWheel(e);
	});

	this.canvas.addEventListener('mousedown', function (e) {
		t.onClick(e);
	});

	// disable right click's context menu
	this.canvas.oncontextmenu = function () {
		return false;
	};

	// buttons menu
	var menu = createDiv('audioEditorMenu', this._dom);

	function makePropertyButton(prop) {
		var button = createDiv('editorButton ' + prop + 'Icon', menu);
		makeButton(button, function () {
			if (!t.bufferData) return;
			t.bufferData[prop] = !t.bufferData[prop];
			button.style.backgroundColor = t.bufferData[prop] ? '#FFF' : '#777';
			t.allowSave(true);
		});
		return button;
	}

	this.loopButton = makePropertyButton('loop');
	this.irButton   = makePropertyButton('ir');


	createDiv('flexSpacer', menu);

	// save button
	this.saveButton = createDiv('editorButton saveIcon', menu);
	makeButton(this.saveButton, function sendRequest() {
		if (!t.canSave) return;
		t.allowSave(false);

		assetLoader.sendRequest({
			command: 'audio.saveProperties',
			bufferData: t.bufferData.serialize()
		});

		beforeClose.setFlag('audio');
	});
	this.allowSave(false);

	// tags section
	var tagSection = createDiv('', this._dom);
	var addTagInput = createDom('input', 'tagInput', tagSection);
	this.tags = createDiv('tags', tagSection);
	this.tags.style.width = WAVEFORM_WIDTH - 105 + 'px';

	addTagInput.onkeypress = function (e) {
		if (e.keyCode !== 13) return;
		var value = addTagInput.value;
		if (value === '') return;
		addTagInput.value = '';
		t.addNewTag(value);
	}
}
inherits(AudioEditor, Panel);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.onScroll = function () {
	var scroll = this.scroll.scrollLeft;

	if (!this.bufferData || !this.bufferData.buffer) return;

	var maxScroll = (WAVEFORM_WIDTH / this.zoom);
	this.offset = ~~(this.bufferData.buffer.length * scroll / maxScroll);

	this.drawWaveform();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.onWheel = function (e) {
	var delta = e.deltaY;

	if (!this.bufferData || !this.bufferData.buffer) return;

	// TODO min zoom should depend on buffer length
	var MIN_ZOOM = 0.03125;
	var zoom = this.zoom;

	this.zoom *= delta < 0 ? 0.625 : 1.6;
	this.zoom = Math.max(MIN_ZOOM, Math.min(1, this.zoom));

	if (this.zoom === zoom) return; // zoom didn't change since last time

	// set offset in the correct range
	this.offset = Math.min(this.offset, ~~(this.bufferData.buffer.length * (1 - this.zoom)));

	// update scrollbar length
	this.scrollContent.style.width = ~~(WAVEFORM_WIDTH / this.zoom) + 'px';
	// TODO: update scrollbar position correctly

	this.drawWaveform();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.onClick = function (e) {
	if (!this.bufferData || !this.bufferData.buffer) return;
	var x = e.layerX;

	var bufferLength = this.bufferData.buffer.length;
	var duration     = this.bufferData.buffer.duration;
	var chunkSize    = bufferLength * this.zoom / WAVEFORM_WIDTH;
	var position     = this.offset + x * chunkSize; // in samples
	position         = position / bufferLength * duration; // in seconds

	if (e.which === 3) {
		this.bufferData.end = position;
	} else {
		this.bufferData.start = position;
	}

	this.allowSave(true);
	this.drawWaveform();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.allowSave = function (value) {
	this.canSave = value;
	// update save button display
	this.saveButton.style.opacity = value ? 1 : 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.drawWaveform = function () {
	var audioData = this.bufferData.buffer.getChannelData(0);
	var bufferLength = this.bufferData.buffer.length; // length in samples (=audioData.length)

	var chunkSize = bufferLength * this.zoom / WAVEFORM_WIDTH;

	this.ctx.fillStyle = '#05f5a7';
	this.ctx.clearRect(0, 0, WAVEFORM_WIDTH, WAVEFORM_HEIGHT);

	var min =  1;
	var max = -1;
	for (var x = 0; x < WAVEFORM_WIDTH; x++) {

		// TODO: compute chunk frequency by counting the number of zero cross

		// get chunk's min and max sample
		for (var c = 0; c < chunkSize; c++) {
			var sample = audioData[~~(this.offset + x * chunkSize + c)];
			if (sample > max) max = sample;
			if (sample < min) min = sample;
		}

		// width of the bar to be drawn, minimum 1px to avoid "holes"
		var w = ~~((max - min) * HALF_HEIGHT);
		if (w < 1) w = 1;
		this.ctx.fillRect(x, HALF_HEIGHT - ~~(max * HALF_HEIGHT), 1, w);

		// keep samples for next chunk to avoid "holes" in the waveform
		var tmp = min;
		min = max;
		max = tmp;
	}

	// add middle line
	this.ctx.fillStyle = 'rgba(200,200,200,0.4)';
	this.ctx.fillRect(0, HALF_HEIGHT, WAVEFORM_WIDTH, 1);

	// TODO: add all the following as interactive dom elements


	// add loop points
	this.ctx.fillStyle = '#F00';

	var duration = this.bufferData.buffer.duration;
	var end = this.bufferData.end;
	if (end < 0) end = duration + end;

	var ratio    = duration * this.zoom;
	var offset   = this.offset / chunkSize;
	var start    = this.bufferData.start / ratio;
	end          = end / ratio;
	this.ctx.fillRect(WAVEFORM_WIDTH * start - offset, 0, 1, WAVEFORM_HEIGHT);
	this.ctx.fillRect(WAVEFORM_WIDTH * end   - offset, 0, 1, WAVEFORM_HEIGHT);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.setBuffer = function (bufferData) {
	var t = this;

	// reset properties
	this.zoom    = 1;
	this.offset  = 0;
	this.allowSave(false);

	// reset display
	this.setTitle(bufferData.id);
	this.scrollContent.style.width = ~~(WAVEFORM_WIDTH / this.zoom) + 'px';
	this.ctx.clearRect(0, 0, WAVEFORM_WIDTH, WAVEFORM_HEIGHT);

	this.loopButton.style.backgroundColor = bufferData.loop ? '#FFF' : '#777';
	this.irButton  .style.backgroundColor = bufferData.ir   ? '#FFF' : '#777';

	// set buffer
	this.bufferData = bufferData;
	this.setTags(bufferData);

	// load buffer
	bufferData.loadAudioBuffer(function (error) {
		if (error) return;
		t.drawWaveform();
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.setTags = function (bufferData) {
	this.tags.innerHTML = '';
	if (!bufferData.tag) return;
	for (var i = 0; i < bufferData.tag.length; i++) {
		this.addTag(bufferData.tag[i])
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/**
 * @param {string} tag - tag name
 */
AudioEditor.prototype.addTag = function (tag) {
	var t = this;

	var container = createDiv('tag', this.tags);
	createDiv('tagTitle', container).innerText = tag;
	var closeButton = createDiv('closeButton', container);

	// close button action
	makeButton(closeButton, function onDelete() {
		removeDom(container, t.tags);
		var index = t.bufferData.tag.indexOf(tag);
		if (index === -1) return;
		t.bufferData.tag.splice(index, 1);
		t.allowSave(true);
	});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
AudioEditor.prototype.addNewTag = function (tag) {
	if (!this.bufferData) return;

	// TODO: sanitize tag string (at least remove " and \ characters)

	// don't add an already existing tag
	if (this.bufferData.tag.indexOf(tag) !== -1) return;

	// adding tag
	this.bufferData.tag.push(tag);
	this.addTag(tag);
	this.allowSave(true);
};

module.exports = new AudioEditor();
