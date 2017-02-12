var modules = require('../core/modules');

modules.add(require('../core/Buffer'));
modules.add(require('./TestModule'));
modules.add(require('./Bang'));
modules.add(require('./AutoBang'));
modules.add(require('./MidiIn'));
modules.add(require('./NoteOnFilter'));
modules.add(require('./ControlChange'));
modules.add(require('./Oscillator'));
modules.add(require('./BufferTrim'));
modules.add(require('./LFO'));
modules.add(require('./Envelope'));
modules.add(require('./Fade'));
modules.add(require('./AutoXFade'));
modules.add(require('./Amp'));
modules.add(require('./Gain'));
modules.add(require('./Panner'));
modules.add(require('./ModPanner'));
modules.add(require('./Sampler'));
modules.add(require('./OneShotSampler'));
modules.add(require('./Filter'));
modules.add(require('./FilterMod'));
modules.add(require('./Convolver'));
modules.add(require('./Delay'));
modules.add(require('./ModDelay'));
modules.add(require('./Volume'));
modules.add(require('./Context'));