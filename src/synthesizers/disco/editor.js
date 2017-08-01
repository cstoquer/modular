exports.create = function (editor, params) {
	editor.resize(10, 9);

	editor.addContainer(0, 1, 4, 8);
	editor.addContainer(3, 1, 4, 8);
	editor.addContainer(6, 1, 4, 8);

	editor.addLabel(1, 0, 2, 'OSC');
	editor.addLabel(4, 0, 2, 'MOD');
	editor.addLabel(7, 0, 2, 'AMP');

	editor.addLabel(1, 4, 2, 'frq'); editor.addKnob(1, 2).bind(params, 'freq',     300, 2000).autoUpdate(); 

	editor.addLabel(4, 4, 2, 'mod'); editor.addKnob(4, 2).bind(params, 'mod',      -800, 800).autoUpdate(); 
	editor.addLabel(4, 7, 2, 'cv');  editor.addKnob(4, 5).bind(params, 'modCurve',    0.1, 3).autoUpdate(); 

	editor.addLabel(7, 4, 2, 'd');   editor.addKnob(7, 2).bind(params, 'envDuration', 0.1, 3).autoUpdate(); 
	editor.addLabel(7, 7, 2, 'cv');  editor.addKnob(7, 5).bind(params, 'ampCurve',    0.1, 3).autoUpdate(); 
};
