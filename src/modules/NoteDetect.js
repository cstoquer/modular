var Module = require('../core/Module');

var MIDI_NOTE_C4 = 60;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function NoteDetect() {
	this.note = MIDI_NOTE_C4;
	Module.call(this);
}
inherits(NoteDetect, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
NoteDetect.prototype.onEvent = function (event) {
	if (event._type !== 'midi message') return;
	if (event.midiType !== 'note on') return;
	if (event.note !== this.note) return;

	this.$OUT.emit(event);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
NoteDetect.prototype.descriptor = {
	type: 'NoteDetect',
	name: 'note detect',
	size: 3,
	inputs:  { IN:  { type: 'event', x:4,  y:0, endPoint: 'onEvent' } },
	outputs: { OUT: { type: 'event', x:5,  y:0 } },
	controls: {
		note: { type: 'knob', x: 1.5, y: 0.5, min: 0, max: 127, endPoint: null, value: 'note', label: 'NOTE', int: true } 
	}
};

module.exports = NoteDetect;