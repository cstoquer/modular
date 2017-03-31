var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function BufferSlice() {
	this.buffer     = null;

	this._nslices   = 16;
	this._slice     = 0;
	this._length    = 1;
	this._startOfst = 0;
	this._endOfst   = 0;

	Module.call(this);
}
inherits(BufferSlice, Module);

// TODO: use defineProperty for slice params in order to check correctness
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Object.defineProperty(BufferSlice.prototype, 'nslices', {
	get: function() { return this._nslices; },
	set: function(value) {
		this._nslices = value; this._setBufferSize(); }
});

Object.defineProperty(BufferSlice.prototype, 'slice', {
	get: function() { return this._slice; },
	set: function(value) { this._slice = value; this._setBufferSize(); }
});

Object.defineProperty(BufferSlice.prototype, 'length', {
	get: function() { return this._length; },
	set: function(value) { this._length = value; this._setBufferSize(); }
});

Object.defineProperty(BufferSlice.prototype, 'startOfst', {
	get: function() { return this._startOfst; },
	set: function(value) { this._startOfst = value; this._setBufferSize(); }
});

Object.defineProperty(BufferSlice.prototype, 'endOfst', {
	get: function() { return this._endOfst; },
	set: function(value) { this._endOfst = value; this._setBufferSize(); }
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferSlice.prototype._setBufferSize = function () {
	var buffer = this._originalBuffer;
	if (!buffer) return;

	// TODO check properties values

	var duration = buffer.end - buffer.start;
	// TODO: check duration
	var sliceDuration = duration / this.nslices;
	var start = buffer.start + this.slice * sliceDuration;
	var end   = start + this.length * sliceDuration;

	start *= 1 + this._startOfst;
	end   *= 1 + this._endOfst;

	this.buffer = {
		buffer: buffer.buffer,
		start:  start,
		end:    end,
		loop:   false
	};

	this.$data.emit({ _type: 'buffer', buffer: this.buffer });
};

BufferSlice.prototype.setBuffer = function (event) {
	if (event._type !== 'buffer') return;

	this._originalBuffer = event.buffer;

	this._setBufferSize();
};

BufferSlice.prototype.onConnect = function (connector) {
	if (!this.buffer) return;
	this.$data.emitTo(connector, { _type: 'buffer', buffer: this.buffer });
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
BufferSlice.prototype.descriptor = {
	type: 'BufferSlice',
	name: 'BufferSlice',
	size: 5,
	inputs:   { buffer: { type: 'event', x:4, y:0, endPoint: 'setBuffer', label: null, singleConnection: true } },
	outputs:  { data:   { type: 'event', x:5, y:0, label: null, onConnect: 'onConnect' } },
	controls: {
		nslice: { type: 'knob', x: 0.2, y: 0.5, min: 2, max: 32, endPoint: null, value: 'nslices', label: 'SLC', int: true },
		slice:  { type: 'knob', x: 2.2, y: 0.5, min: 0, max: 31, endPoint: null, value: 'slice',   label: '#',   int: true },
		length: { type: 'knob', x: 4.2, y: 0.5, min: 1, max: 32, endPoint: null, value: 'length',  label: 'LEN', int: true },
		sofst:  { type: 'knob', x: 1.2, y: 2.5, min: -0.1, max: 0.1, endPoint: null, value: 'startOfst', label: 'STR' },
		eofst:  { type: 'knob', x: 3.2, y: 2.5, min: -0.1, max: 0.1, endPoint: null, value: 'endOfst',   label: 'END' },
	}
};

module.exports = BufferSlice;