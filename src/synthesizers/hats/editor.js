exports.create = function (editor, params) {
	editor.resize(18, 9);

	editor.addContainer( 0, 0, 18, 5);
	editor.addContainer( 0, 4,  6, 5);
	editor.addContainer( 5, 4,  6, 5);
	editor.addContainer(10, 4,  8, 5);

	editor.addLabel(1, 1, 1, 'PATTERN');

	// TODO pattern (text input)
	editor.addKnob( 1, 5).bind(params, 'tempo',   50, 300).setAsInt().autoUpdate(); 
	editor.addKnob( 3, 5).bind(params, 'polyphony',  1, 8).setAsInt().autoUpdate(); 
	editor.addKnob( 6, 5).bind(params, 'close',  0.1, 0.8).autoUpdate(); 
	editor.addKnob( 8, 5).bind(params, 'accent', 0.1, 0.8).autoUpdate(); 
	editor.addKnob(15, 5).bind(params, 'offset',  0, 5000).autoUpdate(); 
};