var audioContext = require('../core/audioContext');
var library      = require('../core/library');
var Module       = require('../core/Module');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Delay(params) {
	this.node = audioContext.createDelay(1);
	Module.call(this, params);
}
inherits(Delay, Module);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Delay.prototype.descriptor = {
	name: 'Delay',
	size: 3,
	inputs:  { IN:  { type: 'audio', x:0.0,  y:1, endPoint: 'node', label: 'IN' } },
	outputs: { OUT: { type: 'audio', x:3.6,  y:1, endPoint: 'node', label: 'OUT' } },
	params:  {
		delay: { type: 'knob', x: 2.0, y: 0.3, min: 0.01, max: 1.0, endPoint: 'node.delayTime', value: 'value', label: 'TIME' },
	}
};

library.register(Delay);
module.exports = Delay;