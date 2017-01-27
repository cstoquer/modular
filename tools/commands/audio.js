var fs   = require('fs');
var path = require('path');
var cwd  = process.cwd();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.saveProperties = function (params, cb) {
	var bufferData = params.bufferData;
	var filePath = path.join(cwd, bufferData.uri) + '.json';
	fs.writeFile(filePath, JSON.stringify(bufferData), 'utf8', cb);
	return cb();
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.generateLibraries = function (params, cb) {
	// TODO: generate 'assets/buffers.json' by merging current data with all metafiles in 'audio'
	// TODO: generate 'assets/audio.json' by walking in 'audio' folder and make a list of all audio files
	return cb();
};
