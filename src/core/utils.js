/**
 * Utility functions
 */
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** map a value from an input interval [iMin ~ iMax] to an output interval [oMin ~ oMax] 
 * preconditions: iMin != iMax
 */
exports.map = function (value, iMin, iMax, oMin, oMax) {
	return oMin + (oMax - oMin) * (value - iMin) / (iMax - iMin);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** Make a deep copy of an object */
// exports.copyObject = function (object) {

// 	function copyObject(source) {
// 		if (typeof source === 'object') {
// 			if (Array.isArray(source)) {
// 				var arrayCopy = [];
// 				for (var i = 0; i < source.length; i++) {
// 					arrayCopy.push(copyObject(source[i]));
// 				}
// 				return arrayCopy;
// 			} else {
// 				// we assume it's a map object
// 				var objectCopy = {};
// 				for (var key in source) {
// 					objectCopy[key] = copyObject(source[key]);
// 				}
// 				return objectCopy;
// 			}
// 		} else {
// 			// we assume it is a simple type
// 			return source;
// 		}
// 	}

// 	return copyObject(object);
// };

exports.copyObject = function (object) {
	return JSON.parse(JSON.stringify(object));
};
