var SynthEditorPanel = require('./SynthEditorPanel');

var synthEditorPanel = new SynthEditorPanel();
// module.exports     = synthEditor;
// window.synthEditor = synthEditor;


var editorBuilders = {};

exports.register = function (synthId, editorBuilder) {
	editorBuilders[synthId] = editorBuilder;
};

exports.hasEditor = function (synthId) {
	return !!editorBuilders[synthId];
};

exports.open = function (synthId, bufferData) {
	synthEditorPanel.init(synthId, bufferData);
	var editorBuilder = editorBuilders[synthId];
	if (!editorBuilder) return console.error('there is no editor for synth "' + synthId + '"');
	editorBuilder.create(synthEditorPanel, bufferData.params);
	// TODO: bind editor header menu with bufferData
	// - open audio editor
	// - play
	// - generate
	// - loop property
	// - tags ?
	// - save ?

	synthEditorPanel.open();
	synthEditorPanel.setOnTop();
};
