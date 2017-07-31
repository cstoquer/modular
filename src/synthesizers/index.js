/**
 * Synthesizers can be added at runtime (before a patch requiring it is loaded)
 *
 * a synth is a module that expose a method `generate` taking two parameters:
 *  - a {BufferData} instance, with informations about synth in bufferData.params
 *  - a callback {function} to call once the synth has filled the buffer with audio
 *
 * The synth is responsible for creating the audio buffer, and filling it and set
 * the `start` and `end` properties of the bufferData.
 *
 * Callback should be deffered if the generate function is synchronous, in order
 * to be consistent with Buffer API that needs to load audio.
 */

var SYNTHESIZERS = {
	'noize': require('./noize'),
	'hats':  require('./hats'),
	'disco': require('./disco'),
};

exports.getSynth = function (id) {
	return SYNTHESIZERS[id];
};

exports.addSynth = function (synth, id) {
	SYNTHESIZERS[id] = synth;
};
