var domUtils     = require('domUtils');
var audioContext = require('./core/audioContext');

// remove pixelbox canvas
domUtils.removeDom($screen.canvas, document.body);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function loadData(path, cb) {
	var xobj = new XMLHttpRequest();
	xobj.responseType = 'arraybuffer';

	xobj.onreadystatechange = function onXhrStateChange() {
		if (~~xobj.readyState !== 4) return;
		if (~~xobj.status !== 200 && ~~xobj.status !== 0) {
			return cb('xhrError:' + xobj.status);
		}
		return cb(null, xobj.response);
	};

	xobj.open('GET', path, true);
	xobj.send();
}

function loadAudioBuffer(path, cb) {
	loadData(path, function (error, buffer) {
		if (error) return cb(error);
		audioContext.decodeAudioData(buffer, function onSuccess(buffer) {
			return cb(null, buffer);
		}, cb);
	});
}

loadAudioBuffer('audio/crystal.mp3', function (error, buffer) {
	window.testBuffer = buffer;
})

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
require('./core/AudioConnector');
require('./core/EventConnector');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
require('./modules/TestModule');
require('./modules/Oscillator');
require('./modules/LFO');
require('./modules/Gain');
require('./modules/Panner');
require('./modules/ModPanner');
require('./modules/Sampler');
require('./modules/Filter');
require('./modules/Delay');
require('./modules/Volume');
require('./modules/Context');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
