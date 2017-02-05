var Module  = require('../core/Module');
var library = require('../ui/moduleLibrary');

var MIDI_NOTE_C4 = 60;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function noteOnFilter() {
	Module.call(this);
}
inherits(noteOnFilter, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
noteOnFilter.prototype.onEvent = function (event) {
	if (event._type !== 'midi message') return;
	if (event.midiType !== 'note on') return;

	var pitch = event.note - MIDI_NOTE_C4;
	event.playbackRate = Math.pow(2, pitch / 12);

	this.$OUT.emit(event);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
noteOnFilter.prototype.descriptor = {
	type: 'noteOnFilter',
	name: 'noteOn',
	size: 1,
	inputs:  { IN:  { type: 'event', x:4,  y:0, endPoint: 'onEvent' } },
	outputs: { OUT: { type: 'event', x:5,  y:0 } },
	controls: {
	}
};

library.register(noteOnFilter);
module.exports = noteOnFilter;