var SynthEditorPanel = require('./SynthEditorPanel');

var synthedit    = new SynthEditorPanel();
module.exports   = synthedit;
window.synthedit = synthedit;

synthedit.resize(10, 9);

synthedit.addContainer(0, 1, 4, 8);
synthedit.addContainer(3, 1, 4, 8);
synthedit.addContainer(6, 1, 4, 8);

synthedit.addLabel(1, 0, 2, 'OSC');
synthedit.addLabel(4, 0, 2, 'MOD');
synthedit.addLabel(7, 0, 2, 'AMP');

synthedit.addKnob(1, 2); synthedit.addLabel(1, 4, 2, 'frq');
synthedit.addKnob(1, 5); synthedit.addLabel(1, 7, 2, '%');

synthedit.addKnob(4, 2); synthedit.addLabel(4, 4, 2, 't');
synthedit.addKnob(4, 5); synthedit.addLabel(4, 7, 2, 'crv');

synthedit.addKnob(7, 2); synthedit.addLabel(7, 4, 2, 't');
synthedit.addKnob(7, 5); synthedit.addLabel(7, 7, 2, 'crv');

