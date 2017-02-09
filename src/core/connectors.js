/** ConnectorFactory
 *
 * @author Cedric Stoquer
 */
connectors = {
	input:  {},
	output: {}
};

exports.register = function (ConnectorClass, way, type) {
	if (!connectors[way]) return;
	connectors[way][type] = ConnectorClass;
};

exports.getConnector = function (way, type) {
	if (!connectors[way]) return undefined;
	return connectors[way][type];
};

require('./AudioConnector');
require('./EventConnector');
require('./ParamConnector');
