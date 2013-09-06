exports.serviceName = 'Directory';
exports.create = create;
exports['delete'] = _delete;
exports.rename = rename;
exports.copy = copy;
exports.move = move;

var createDir = require('../lib/createDir').createDir,
	deleteDir = require('../lib/deleteDir').deleteDir,
	renameDir = require('../lib/renameDir').renameDir,
	copyDir = require('../lib/copyDir').copyDir,
	moveDir = require('../lib/moveDir').moveDir;

function create(args, callback) {
	createDir(args.dirPathAbs, args.dirName, success, failure);

	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function _delete(args, callback) {
	deleteDir(args.dirPathAbs, success, function(){}, failure);
	
	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function rename(args, callback) {
	renameDir(args.dirPathAbs, args.newName, success, failure);
	
	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function copy(args, callback) {
	copyDir(args.srcDirPathAbs, args.targetDirPathAbs, success, function(){}, failure);
	
	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function move(args, callback) {
	moveDir(args.srcDirPathAbs, args.targetDirPathAbs, success, empty, empty, failure);

	function empty() {

	}
	
	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

