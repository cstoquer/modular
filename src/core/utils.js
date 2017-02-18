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