var audioContext = require('../core/audioContext');
var Module       = require('../core/Module');

WAVEFORM_TYPE_ENUM = [
	{ id: 'sine',     caption: 'sin' },
    { id: 'square',   caption: 'sqr' },
    { id: 'sawtooth', caption: 'saw' },
    { id: 'triangle', caption: 'tri' },
    // { id: 'custom',   caption: 'usr' }
]

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function LFO() {
	this._waveType = 0;

	this.node = audioContext.createOscillator();
	this.node.frequency.value = 2.0;
	this.node.type = WAVEFORM_TYPE_ENUM[this._waveType].id;
	this.node.start();
	Module.call(this);

	this.$$type.setTitle(WAVEFORM_TYPE_ENUM[this._waveType].caption);
}
inherits(LFO, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
LFO.prototype.switchType = function () {
	this.waveform += 1;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Object.defineProperty(LFO.prototype, 'waveform', {
	get: function() {
		return this._waveType;
	},
	set: function(value) {
		this._waveType = value % WAVEFORM_TYPE_ENUM.length;
		this.node.type = WAVEFORM_TYPE_ENUM[this._waveType].id;
		this.$$type.setTitle(WAVEFORM_TYPE_ENUM[this._waveType].caption);
	}
});

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
LFO.prototype.descriptor = {
	type: 'LFO',
	name: 'LFO',
	size: 3,
	inputs:  {},
	outputs: { OUT: { type: 'audio', x:5,  y:1, endPoint: 'node', label: null } },
	controls: {
		frequency: { type: 'knob', x: 2.5, y: 0.3, min: 0.001, max: 10.0, endPoint: 'node.frequency', value: 'value', label: 'FREQ' },
		type: { type: 'button', x: 0.2, y: 1.2, endPoint: 'switchType' }
	},
	persistent: ['waveform']
};

module.exports = LFO;