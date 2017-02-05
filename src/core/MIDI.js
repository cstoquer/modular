
MIDI_MESSAGE_TYPES = {
	8:  'note off',
	9:  'note on',
	10: 'aftertouch',
	11: 'control change',
	12: 'program change',
	13: 'channel pressure',
	14: 'pitch bend'
};

var MIDI = new EventEmitter();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function onMessage(message) {
	var data = message.data;
	var status = data[0];
	if (status >= 240) return; // TODO: system common messages
	var typeId  = (status & 240) >> 4;
	var type = MIDI_MESSAGE_TYPES[typeId];
	if (!type) return;
	var channel = (status & 15);
	var data1 = data[1];
	var data2 = data[2];

	var e = { _type: 'midi message', channel: channel, midiType: type };

	switch (type) {
		case 'note on':
		case 'note off':
			e.note     = data1;
			e.velocity = data2;
			break;
		case 'control change':
			e.control  = data1;
			e.value    = data2;
			break;
		// TODO: aftertouch
		// TODO: program change
		// TODO: channel pressure
		// TODO: pitch bend
		default:
			e.data1 = data1;
			e.data2 = data2;
	}

	MIDI.emit('message', e);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function onMidiFailure(error) {
	console.error('requestMIDIAccess failed', error);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function onMidiSuccess(midiAccess) {
	var inputs = midiAccess.inputs.values();
	for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
		input.value.onmidimessage = onMessage;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var isOpened = false;

module.exports = MIDI;

MIDI.open = function openMidi() {
	if (isOpened) return;
	isOpened = true;
	navigator.requestMIDIAccess({ sysex: false }).then(onMidiSuccess, onMidiFailure);
};