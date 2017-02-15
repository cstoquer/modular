var sendRequest = require('./assetLoader').sendRequest;

var FLAGS = {
	audio: false
};

exports.setFlag = function (id) {
	FLAGS[id] = true;
};

window.onbeforeunload = function beforeClosing() {
	if (FLAGS.audio) sendRequest({ command: 'audio.generateLibrary' });
};
