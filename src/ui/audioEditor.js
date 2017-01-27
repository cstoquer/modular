var assetLoader  = require('assetLoader');
var Panel        = require('./Panel');
var domUtils     = require('domUtils');
var createDom    = domUtils.createDom;
var createDiv    = domUtils.createDiv;
var makeButton   = domUtils.makeButton;
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

	// dom elements

	// this.menu = createDiv('', this._dom);
	// this.menu.style.height = '20px';

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

	// save button
	this.canSave = false;
	var saveButton = createDiv('audioEditorSaveButton', this._dom);
	makeButton(saveButton, function sendRequest() {
		if (!t.canSave) return;
		t.canSave = false;

		// TODO
		assetLoader.sendRequest({
			command: 'audio.saveProperties',
			bufferData: t.bufferData.serialize()
		});
	});
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

	this.canSave = true;
	this.drawWaveform();
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

	this.setTitle(bufferData.id);
	// reset properties
	this.bufferData = bufferData;
	this.canSave = false;

	// load buffer
	bufferData.loadAudioBuffer(function (error) {
		if (error) return;
		t.drawWaveform();
	});
};

module.exports = new AudioEditor();
