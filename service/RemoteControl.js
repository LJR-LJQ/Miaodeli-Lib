exports.serviceName = 'RemoteControl';
exports.captureScreen = captureScreen;
exports.shutdown = shutdown;
exports.reboot = reboot;

// var captureScreen = require('../lib/captureScreen').captureScreen,
// 	shutdown = require('../lib/shutdownComputer').shutdownComputer;

var captureScreen = require('../captureScreen-fix').captureScreen,
	shutdownComputer = require('../lib/shutdownComputer').shutdownComputer,
	rebootComputer = require('../lib/rebootComputer').rebootComputer;

function captureScreen(args, callback) {
	var filePathAbs = args.filePathAbs;
	// TODO 检查 args
	captureScreen(filePathAbs, function() {
		callback({});
	}, function() {
		callback({error: 'capture screen failed'});
	});
}

function shutdown(args, callback) {
	shutdownComputer(function() {
		callback({});
	}, function() {
		callback({error: 'shutdown computer failed'});
	});
}

function reboot(args, callback) {
	rebootComputer(function() {
		callback({});
	}, function() {
		callback({error: 'reboot computer failed'});
	});
}