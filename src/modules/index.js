var modules = require('../core/modules');

modules.add(require('../core/Buffer'));
modules.add(require('./TestModule'));
modules.add(require('./BufferTrim'));

// event
modules.add(require('./Bang'));
modules.add(require('./AutoBang'));
modules.add(require('./RandomBang'));
modules.add(require('./DateBang'));
modules.add(require('./OnLoadBang'));
modules.add(require('./EventPool'));
modules.add(require('./EventDelay'));
modules.add(require('./PlaybackRate'));

// MIDI
modules.add(require('./MidiIn'));
modules.add(require('./NoteOnFilter'));
modules.add(require('./ControlChange'));

// Oscillator, LFO
modules.add(require('./Oscillator'));
modules.add(require('./LFO'));
modules.add(require('./SlowLFO'));

// envelope
modules.add(require('./Envelope'));
modules.add(require('./Fade'));

// amp, pan
modules.add(require('./Volume'));
modules.add(require('./Amp'));
modules.add(require('./AutoXFade'));
modules.add(require('./Gain'));
modules.add(require('./Panner'));
modules.add(require('./ModPanner'));

// sampler
modules.add(require('./Sampler'));
modules.add(require('./OneShotSampler'));
modules.add(require('./XFadeSampler'));

// filter
modules.add(require('./Filter'));
modules.add(require('./FilterMod'));

// reverb, delay, fx
modules.add(require('./Convolver'));
modules.add(require('./Delay'));
modules.add(require('./ModDelay'));

// out
modules.add(require('./Context'));
