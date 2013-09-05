exports.serviceName = 'File';
exports.create = create;
exports['delete'] = _delete;
exports.rename = rename;
exports.copy = copy;
exports.move = move;

var createFile = require('../lib/createFile').createFile,
	deleteFile = require('../lib/deleteFile').deleteFile,
	renameFile = require('../lib/renameFile').renameFile,
	copyFile = require('../lib/copyFile').copyFile,
	moveFile = require('../lib/moveFile').moveFile;

function create(args, callback) {
	createFile(args.dirPathAbs, args.fileName, success, failure);

	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function _delete(args, callback) {
	deleteFile(args.filePathAbs, success, failure);

	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function rename(args, callback) {
	renameFile(args.filePathAbs, args.newName, success, failure);

	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function copy(args, callback) {
	copyFile(args.srcFilePathAbs, args.targetFilePathAbs, success, failure);

	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}

function move(args, callback) {
	moveFile(args.srcFilePathAbs, args.targetFilePathAbs, success, failure);

	function success() {
		callback({});
	}

	function failure() {
		callback({error: 'unknwon'});
	}
}