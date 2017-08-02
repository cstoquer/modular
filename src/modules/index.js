var modules  = require('../core/modules');
var CATEGORY = require('../core/moduleCategories');


modules.add(require('../core/Buffer'),   CATEGORY.DATA);
modules.add(require('./BufferTrim'),     CATEGORY.DATA);
modules.add(require('./BufferSlice'),    CATEGORY.DATA);
modules.add(require('./TestModule'),     CATEGORY.DATA);
modules.add(require('./EventPool'),      CATEGORY.DATA);
modules.add(require('./EventDelay'),     CATEGORY.DATA);
modules.add(require('./PlaybackRate'),   CATEGORY.DATA);

// event
modules.add(require('./Bang'),           CATEGORY.CONTROL);
modules.add(require('./AutoBang'),       CATEGORY.CONTROL);
modules.add(require('./RandomBang'),     CATEGORY.CONTROL);
modules.add(require('./DateBang'),       CATEGORY.CONTROL);
modules.add(require('./OnLoadBang'),     CATEGORY.CONTROL);

// MIDI
modules.add(require('./MidiIn'),         CATEGORY.CONTROL);
modules.add(require('./NoteOnFilter'),   CATEGORY.CONTROL);
modules.add(require('./ControlChange'),  CATEGORY.CONTROL);
modules.add(require('./NoteDetect'),     CATEGORY.CONTROL);

// Oscillator, LFO
modules.add(require('./Oscillator'),     CATEGORY.OSC);
modules.add(require('./LFO'),            CATEGORY.OSC);
modules.add(require('./SlowLFO'),        CATEGORY.OSC);

// envelope
modules.add(require('./Envelope'),       CATEGORY.ENVELOPE);
modules.add(require('./Fade'),           CATEGORY.ENVELOPE);

// amp, pan
modules.add(require('./Volume'),         CATEGORY.GAIN);
modules.add(require('./Amp'),            CATEGORY.GAIN);
modules.add(require('./AutoXFade'),      CATEGORY.GAIN);
modules.add(require('./Gain'),           CATEGORY.GAIN);
modules.add(require('./Panner'),         CATEGORY.GAIN);
modules.add(require('./ModPanner'),      CATEGORY.GAIN);

// sampler
modules.add(require('./Sampler'),        CATEGORY.SAMPLER);
modules.add(require('./OneShotSampler'), CATEGORY.SAMPLER);
modules.add(require('./XFadeSampler'),   CATEGORY.SAMPLER);

// filter
modules.add(require('./Filter'),         CATEGORY.FILTER);
modules.add(require('./FilterMod'),      CATEGORY.FILTER);

// reverb, delay, fx
modules.add(require('./Convolver'),      CATEGORY.EFFECT);
modules.add(require('./Delay'),          CATEGORY.EFFECT);
modules.add(require('./ModDelay'),       CATEGORY.EFFECT);

// out
modules.add(require('./Context'),        CATEGORY.IN_OUT);
