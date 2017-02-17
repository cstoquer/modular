var audioEditor = require('./audioEditor');
var BufferData  = require('../data/BufferData');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function readJson(file) {
	var reader = new FileReader();
	reader.onload = function (e) {
		var contents = e.target.result;
		var data;
		try {
			data = JSON.parse(contents);
		} catch (error) {
			return console.error(error);
		}
		if (data._type && data._type === 'modularPatch') {
			window.moduleManager.setPatch(data);
		}
	};
	reader.readAsText(file);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
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

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function openFiles(e) {
	var files = e.dataTransfer.files;
	var file  = files[0]; // TODO: all files

	var ext = file.name.split('.').pop();

	switch (ext) {
		case 'json': readJson(file); break;
		case 'mp3':  readMp3(file); break;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// drag & drop patch files
document.body.addEventListener('dragover', function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}, false);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
document.body.addEventListener('drop', function (e) {
	e.stopPropagation();
	e.preventDefault();
	openFiles(e);
}, false);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
document.addEventListener('drop', function (e) {
	e.preventDefault();
	e.stopPropagation();
	openFiles(e);
});

document.addEventListener('dragover', function (e) {
	e.preventDefault();
	e.stopPropagation();
});
