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
}

function _delete(args, callback) {
	deleteDir(args.filePathAbs, success, function(){}, failure);
}

function rename(args, callback) {
	renameDir(args.dirPathAbs, args.newName, success, failure);
}

function copy(args, callback) {
	copyFile(args.srcDirPathAbs, args.targetDirPathAbs, success, function(){}, failure);
}

function move(args, callback) {
	moveFile(args.srcDirPathAbs, args.targetDirPathAbs, success, empty, empty, failure);

	function empty() {

	}
}


function success() {
	callback({});
}

function failure() {
	callback({error: 'unknwon'});
}