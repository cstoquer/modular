var audioContext = require('./core/audioContext');
var BufferData   = require('./data/BufferData');

BufferData.initializeDatabase(window.assets.buffers);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
require('./core/AudioConnector');
require('./core/EventConnector');
require('./ui/menuHeader');
var ProceduralBuffer = require('./data/ProceduralBuffer');
require('./ui/bufferLibrary').add(new ProceduralBuffer('whiteNoise', { loop: true, start: 0, end: 0.5 }));
var audioEditor = require('./ui/audioEditor');
// require('./ui/audioLibrary');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TODO: automaticaly require modules from walker
require('./modules/TestModule');
require('./modules/Oscillator');
require('./modules/LFO');
require('./modules/Gain');
require('./modules/Panner');
require('./modules/ModPanner');
require('./modules/RingModulator');
require('./modules/Sampler');
require('./modules/Filter');
require('./modules/Delay');
require('./modules/Volume');
require('./modules/Context');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// drag & drop patch files

function readJson(file) {
	var reader = new FileReader();
	reader.onload = function (e) {
		var contents = e.target.result;
		try {
			var data = JSON.parse(contents);
			if (data._type && data._type === 'modularPatch') {
				window.moduleManager.setPatch(data);
			}
		} catch (error) {
			console.error(error);
		}
	};
	reader.readAsText(file);
}

function readMp3(file) {
	var id = file.name.split('.');
	id.pop();
	id = id.join('.');

	// create a bufferData for this file if it doesn't exist yet
	var bufferData = window.assets.buffers[id];
	if (!bufferData) {
		bufferData = new BufferData(id, { uri: 'audio/' + file.name });
	}
	audioEditor.setBuffer(bufferData);
	audioEditor.open();
}

document.body.addEventListener('dragover', function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}, false);

document.body.addEventListener('drop', function (e) {
	e.stopPropagation();
	e.preventDefault();
	var files = e.dataTransfer.files;
	var file  = files[0]; // TODO: all files

	var ext = file.name.split('.').pop();

	switch (ext) {
		case 'json': readJson(file); break;
		case 'mp3':  readMp3(file); break;
	}
}, false);
