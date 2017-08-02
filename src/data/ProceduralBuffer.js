var synthesizers = require('../synthesizers');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function ProceduralBuffer(id, data) {
	this.id          = id;
	this.buffer      = undefined;        // audio buffer
	this.synthesizer = data.synthesizer; // synthesizer id
	this.params      = data.params;      // synth parameters

	// normal bufferData compatibility
	this.loop   = data.loop  || false;
	this.ir     = data.ir    || false;
	this.start  = data.start || 0;
	this.end    = data.end   || 0;
	this.tag    = data.tag   || [];
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// static methods & attribute

ProceduralBuffer.deserialize = function (data) {
	// TODO: check for this ProceduralBuffer existence in the database
	return new ProceduralBuffer(data.id, data);
};

ProceduralBuffer.prototype.type = 'ProceduralBuffer';

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ProceduralBuffer.prototype.serialize = function () {
	return {
		_type:      'ProceduralBuffer',
		id:          this.id,
		synthesizer: this.synthesizer,
		params:      this.params,
		loop:        this.loop,
		ir:          this.ir,
		start:       this.start,
		end:         this.end,
		tag:         this.tag
	};
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ProceduralBuffer.prototype.loadAudioBuffer = function (cb) {
	// check if buffer is already generated
	if (this.buffer) return window.setTimeout(cb, 0);
	this.generateBuffer(cb);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
ProceduralBuffer.prototype.generateBuffer = function (cb) {
	// get proper synthesizer
	var synth = synthesizers.getSynth(this.synthesizer);
	if (!synth) {
		// defer callback
		window.setTimeout(function () {
			cb('Synthesizer ' + this.synthesizer + ' does not exists.');
		}, 0);
		return;
	}

	synth.generate(this, cb);
};

module.exports = ProceduralBuffer;
