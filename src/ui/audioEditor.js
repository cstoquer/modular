var domUtils  = require('domUtils');
var createDom = domUtils.createDom;
var createDiv = domUtils.createDiv;
var makeDragable = domUtils.makeDragable;


var WAVEFORM_WIDTH  = 800;
var WAVEFORM_HEIGHT = 200;
var HALF_HEIGHT     = ~~(WAVEFORM_HEIGHT / 2);
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** AudioEditor
 *
 * @author Cedric Stoquer
 */
function AudioEditor() {
	this.dom = createDiv('panel');

	var handle = createDiv('handle', this.dom);
	makeDragable(handle, this.dom);

	this.canvas = createDom('canvas', 'waveform', this.dom);
	this.canvas.width  = WAVEFORM_WIDTH;
	this.canvas.height = WAVEFORM_HEIGHT;
	this.canvas.style.width  = WAVEFORM_WIDTH  + 'px';
	this.canvas.style.height = WAVEFORM_HEIGHT + 'px';
	this.ctx = this.canvas.getContext('2d');
}

AudioEditor.prototype.setBuffer = function (bufferData) {
	var t = this;

	this.ctx.fillStyle = '#05f5a7';

	bufferData.loadAudioBuffer(function (error) {
		if (error) return;
		var audioData = bufferData.buffer.getChannelData(0);
		var chunkSize = ~~(audioData.length / WAVEFORM_WIDTH);

		for (var x = 0; x < WAVEFORM_WIDTH; x++) {
			var min =  1;
			var max = -1;
			// TODO: compute chunk frequency by counting the number of zero cross
			for (var c = 0; c < chunkSize; c++) {
				var sample = audioData[x * chunkSize + c];
				if (sample > max) max = sample;
				if (sample < min) min = sample;
			}
			t.ctx.fillRect(x, HALF_HEIGHT - ~~(max * HALF_HEIGHT), 1, ~~((max - min) * HALF_HEIGHT));
		}
		// add middle line
		t.ctx.fillStyle = 'rgba(200,200,200,0.4)';
		t.ctx.fillRect(0, HALF_HEIGHT, WAVEFORM_WIDTH, 1);

		// add loop points
		var duration = bufferData.buffer.duration;
		var start = bufferData.start / duration;
		t.ctx.fillRect(start * WAVEFORM_WIDTH, 0, 1, WAVEFORM_HEIGHT);

		// TODO: end point

	});
};

module.exports = new AudioEditor();
