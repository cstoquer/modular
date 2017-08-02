var fs   = require('fs');
var path = require('path');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var commands = {};

function addCommandModule(moduleName, modulePath) {
	var module = require(modulePath);
	commands[moduleName] = {};
	for (var keys = Object.keys(module), i = 0; i < keys.length; i++) {
		var commandName = keys[i];
		var command = module[commandName];
		if (typeof command !== 'function') continue;
		commands[moduleName][commandName] = command;
	}
}

function getCommandModules(dir) {
	var fileList = fs.readdirSync(dir);

	for (var i = 0; i < fileList.length; i++) {
		var fileName = fileList[i];
		var moduleName = path.parse(fileName).name;
		var modulePath = path.join(dir, fileName);
		addCommandModule(moduleName, modulePath);
	}
}

getCommandModules(path.join(process.cwd(), 'tools/commands')); // project's custom commands

function noop() {};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function commandRequest(message, cb) {
	cb = cb || noop;

	if (!message.command) return cb('Empty command');
	var command = message.command.split('.');
	if (command.length !== 2) return cb('Incorrect command format');

	var moduleId  = command[0];
	var commandId = command[1];

	if (!commands[moduleId] || !commands[moduleId][commandId]) return cb('Unknown command');

	console.log('\033[101mCOMMAND\033[0m ' + moduleId + '.' + commandId);
	commands[moduleId][commandId](message, cb);
}

module.exports = commandRequest;
