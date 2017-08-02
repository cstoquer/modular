/**
 * main file being builded for Electron
 */
window.inherits = require('inherits');

// require('./modules');
// require('./data/dataTypes');

window.MODULAR = {
	Patch: require('./core/Patch'),    // for loading patch
	Synths: require('./synthesizers'), // for adding external synthesizers
};
