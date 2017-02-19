var LFO = require('./LFO');
var audioContext = require('../core/audioContext');


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function SlowLFO() {
	LFO.call(this);
	this.node.frequency.value = 0.005;
	this.$$frequency.initValue();
}
inherits(SlowLFO, LFO);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
SlowLFO.prototype.descriptor = {
	type: 'SlowLFO',
	name: 'SlowLFO',
	size: 3,
	inputs:  {},
	outputs: { OUT: { type: 'audio', x:5,  y:1, endPoint: 'node', label: null } },
	controls: {
		frequency: { type: 'knob', x: 2.8, y: 0.3, min: 0.0001, max: 0.01, endPoint: 'node.frequency', value: 'value', label: 'FREQ' },
		type: { type: 'button', x: 0.2, y: 1.2, endPoint: 'switchType' }
	},
	persistent: ['waveform']
};

module.exports = SlowLFO;