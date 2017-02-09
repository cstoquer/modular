require('./core/audioContext');
require('./core/AudioConnector');
require('./core/EventConnector');
require('./core/ParamConnector');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TODO: automaticaly require modules from walker
require('./modules/TestModule');
require('./modules/Bang');
require('./modules/AutoBang');
require('./modules/MidiIn');
require('./modules/noteOnFilter');
require('./modules/ControlChange');
require('./modules/Oscillator');
require('./modules/BufferTrim');
require('./modules/LFO');
require('./modules/Envelope');
require('./modules/Fade');
require('./modules/AutoXFade');
require('./modules/Amp');
require('./modules/Gain');
require('./modules/Panner');
require('./modules/ModPanner');
require('./modules/Sampler');
require('./modules/OneShotSampler');
require('./modules/Filter');
require('./modules/FilterMod');
require('./modules/Convolver');
require('./modules/Delay');
require('./modules/ModDelay');
require('./modules/Volume');
require('./modules/Context');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
require('./data/BufferData').initializeDatabase(window.assets.buffers);

require('./ui/menuHeader');
require('./ui/moduleGUI');
require('./ui/connectorGUI');
require('./ui/cableGUI');
require('./ui/knobGUI');
require('./ui/buttonGUI');

var ProceduralBuffer = require('./data/ProceduralBuffer');
require('./ui/bufferLibrary').add(new ProceduralBuffer('whiteNoise', { loop: true, start: 0, end: 0.5 })); // TODO
require('./ui/dropFile');
require('./ui/moduleLibrary').addEntries(require('./core/modules').getLibrary());