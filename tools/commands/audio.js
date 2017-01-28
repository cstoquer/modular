var fs   = require('fs');
var path = require('path');
var cwd  = process.cwd();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// TODO: reuse the getAssetModule defined in pixelbox
function filterByExtension(extList) {
	var regExps = [];
	for (var i = 0; i < extList.length; i++) {
		regExps.push(new RegExp('\.' + extList[i] + '$'));
	}
	return function (fileName) {
		for (var i = 0; i < regExps.length; i++) {
			if (fileName.search(regExps[i]) !== -1) return true;
		}
		return false;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getAssets(assetDir, assetFilters) {
	var result = { dat: {}, root: assetDir + '/' };

	for (var i = 0; i < assetFilters.length; i++) {
		var id = assetFilters[i].id;
		if (id) result[id] = [];
	}

	var rootDir = process.cwd();

	function getAssetList(dir, subdir, currentDat) {
		var assetList = fs.readdirSync(path.join(rootDir, dir));

		// get directories list
		var dirList = assetList.filter(function (fileName) {
			var stats = fs.statSync(path.join(rootDir, dir, fileName));
			return stats.isDirectory();
		});

		function addToList(list, arr, params) {
			for (var i = 0; i < list.length; i++) {
				var fileName = list[i];
				var id = path.join(subdir, fileName).replace(/\\/gi, '/');

				var value = null;

				if (arr) {
					arr.push(id);
				} else {
					value = fs.readFileSync(path.join(rootDir, dir, fileName), { encoding: 'utf8' });
					if (params.parser) value = params.parser(value);
				}

				var withoutExt = fileName.split('.');
				withoutExt.pop();
				withoutExt = withoutExt.join('.');

				currentDat[withoutExt] = value;
			}
		}

		for (var i = 0; i < assetFilters.length; i++) {
			var type = assetFilters[i];
			var arr = type.id ? result[type.id] : null;
			addToList(assetList.filter(filterByExtension(type.ext)), arr, type);
		}

		// recurse on subdirectories
		for (var i = 0; i < dirList.length; i++) {
			var id = dirList[i];
			if (!currentDat[id]) currentDat[id] = {};
			getAssetList(path.join(dir, id), path.join(subdir, id), currentDat[id]);
			// remove empty json container
			if (Object.keys(currentDat[id]).length === 0) delete currentDat[id];
		}
	}

	getAssetList(assetDir, '', result.dat);
	return result;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function getStaticAssetList() {
	var staticAssetList = getAssets('audio', [
		{ ext: ['mp3'], id: 'sound' },
	]);
	return JSON.stringify(staticAssetList);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.saveProperties = function (params, cb) {
	var bufferData = params.bufferData;

	var withoutExt = bufferData.uri.split('.');
	withoutExt.pop();
	withoutExt = withoutExt.join('.');

	var filePath = path.join(cwd, withoutExt) + '.json';
	fs.writeFile(filePath, JSON.stringify(bufferData), 'utf8', cb);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.generateLibraries = function (params, cb) {
	// map all audio files inside the 'audio' folder
	var audioList = getAssets('audio', [
		{ ext: ['mp3'], id: 'sound' }
	]).sound;

	// get buffer list as defined in 'assets/buffers.json'
	var buffers;
	try {
		buffers = fs.readFileSync(path.join(cwd, 'assets/buffers.json'), 'utf8');
		buffers = JSON.parse(buffers);
	} catch (e) {
		buffers = {};
	}

	// check that all BufferData are still valid
	for (var id in buffers) {
		var buffer = buffers[id];

		// only consider buffers linked to an audio file
		if (buffer._type !== 'BufferData') continue;
		var uri = buffer.uri;

		// file should be in 'audio/' folder
		if (uri.substring(0, 6) !== 'audio') continue;
		uri = uri.substring(6);

		// check that the uri is in the list of files in 'audio' folder
		if (audioList.indexOf(uri) === -1) {
			delete buffers[id];
		}
	}

	// generate 'assets/buffers.json' by merging current data with all metafiles in 'audio'
	var audioMeta = getAssets('audio', [
		{ ext: ['json'], parser: JSON.parse },
	]).dat;

	for (var id in audioMeta) {
		buffers[id] = audioMeta[id];
	}

	// write back buffers list on disc
	fs.writeFileSync(path.join(cwd, 'assets/buffers.json'), JSON.stringify(buffers), 'utf8');
	// fs.writeFileSync(path.join(cwd, 'assets/audioFiles.json'), JSON.stringify(audioList), 'utf8');

	return cb();
};
