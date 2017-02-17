var audioContext    = require('../core/audioContext');
var loadAudioBuffer = require('../loaders/loadAudioBuffer');

var EPSILON = 0.0001;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Voice(sample) {
	this.sample  = sample;
	this.head    = 0; // position of reading head in the sample
	this.decay   = 1; // envelope decay
	this.env     = 1; // current envelope value
	this.volume  = 1; // final volume (accent)
	this.stopped = true;
}

Voice.prototype.start = function (decay, volume) {
	this.decay   = decay;
	this.volume  = volume;
	this.head    = 0;
	this.env     = 1;
	this.stopped = false;
};

Voice.prototype.play = function () {
	if (this.stopped) return 0;
	if (this.head >= this.sample.length) {
		this.stopped = true;
		return 0;
	}

	var sample = this.sample[this.head++];
	var volume = this.env * this.volume;
	sample   *= volume;
	this.env *= this.decay;

	if (volume < EPSILON) this.stopped = true;

	return sample;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.generate = function (bufferData, cb) {

	// get sound informations
	var params    = bufferData.params;
	var pattern   = params.pattern   || 'C...';
	var offset    = params.offset    || 0;
	var polyphony = params.polyphony || 1;
	var tempo     = params.tempo     || 120;
	var close     = params.close     || 0.5;
	var accent    = params.accent    || 0.5;

	// load sample buffer
	loadAudioBuffer(params.uri, function onBufferLoaded(error, sample) {
		if (error) return cb(error);

		// create voices
		var sampleLength = sample.length - offset;
		var sampleData = new Float32Array(sampleLength);
		sample.copyFromChannel(sampleData, 0, offset);
		var voices = [];
		for (var i = 0; i < polyphony; i++) {
			voices.push(new Voice(sampleData));
		}

		// pattern values
		var sampleRate = sample.sampleRate;
		var stepSize   = ~~(sampleRate * 15 / tempo); // 1 step = 1/4 beat
		var length     = stepSize * pattern.length;

		// close ratio
		close = Math.pow(close, 10 / sampleLength);

		// note values
		var NOTES = {
			'O': { volume: 1,      decay: 1     },
			'o': { volume: accent, decay: 1     },
			'C': { volume: 1,      decay: close },
			'c': { volume: accent, decay: close }
		};

		// create pattern buffer
		var buffer = audioContext.createBuffer(1, length, sampleRate);

		// generate buffer data
		var channelData = buffer.getChannelData(0);
		var step = 0;
		var stepPosition = 0;
		var currentVoice = 0;
		for (var t = 0; t < length; t++) {
			if (stepPosition-- === 0) {
				stepPosition = stepSize;

				// trigger next note
				var note = NOTES[pattern[step]];
				// TODO: '|'
				if (note) {
					currentVoice = (currentVoice + 1) % voices.length;
					voices[currentVoice].start(note.decay, note.volume);
				}
				step++;
			}
			var value = 0;
			for (var i = 0; i < voices.length; i++) {
				value += voices[i].play();
			}
			channelData[t] = value;
		}

		// TODO: continue to fill buffer from buffer start if voices are not stopped

		// append data
		bufferData.buffer = buffer;
		bufferData.start  = 0;
		bufferData.end    = buffer.duration;

		return cb();
	});
}