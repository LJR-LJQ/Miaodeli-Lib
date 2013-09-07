exports.serviceName = 'AliyunOSS';
exports.createUploadTask = createUploadTask;
exports.deleteUploadTask = deleteUploadTask;
exports.queryUploadTask = queryUploadTask;
exports.start = start;
exports.pause = pause;
exports.resume = resume;
exports.cancel = cancel;

// [模块]
var uploadFile = require('./AliyunOSS/lib/uploadFile').uploadFile;

// [变量]
var idCount = 0;
var uploadTaskHeap = {};
var uploadTaskList = [];

// args
// - filePathAbs
// res
// - uploadTaskId
function createUploadTask(args, callback) {
	var uploadTaskId = addUploadTask(args.filePathAbs);
	callback({uploadTaskId: uploadTaskId});

	function addUploadTask(filePathAbs) {
		var id = idCount++;
		var uploadTask = {
			id: id,
			filePathAbs: filePathAbs
		};
		uploadTaskHeap[id] = uploadTask;

		// 将 id 记录到列表
		uploadTaskList.push(id);

		return id;
	}
}

// args
// - uploadTaskId
// res
// - uploadTaskId
function deleteUploadTask(args, callback) {
	var uploadTaskId,
		uploadTask;

	// TODO 检查 args

	uploadTaskId = args.uploadTaskId;

	// 注意这里处理得比较简单，只是简单的把任务从列表中拿掉
	// 没有考虑任务当前处于何种状态
	findUploadTaskEx(uploadTaskId, findSuccess, callback);


	function findSuccess(uploadTask) {
		// 从堆里删除
		delete uploadTaskHeap[uploadTaskId];

		// 从 id 列表里也要删除
		uploadTaskList = removeFromList(uploadTaskId);

		callback({uploadTaskId: uploadTaskId});

		function removeFromList(id) {
			var newList = uploadTaskList.filter(function(_id) {
				return _id !== id;
			});
			return newList;
		}
	}
}

// args
// - uploadTaskId
// res
function queryUploadTask(args, callback) {
	var uploadTaskId,
		uploadTask;

	uploadTaskId = args.uploadTaskId;

	// 如果找不到对应的任务，返回错误提示
	findUploadTaskEx(uploadTaskId, function(uploadTask) {
		// 找到了，但是不能直接返回整个任务信息
		// 而是有所精简
		var uploadTaskSimple = simpleCopy(uploadTask);
		callback(uploadTaskSimple);
	}, callback);

	function simpleCopy(uploadTask) {
		var copy = {
			id: uploadTask.id,
			filePathAbs: uploadTask.filePathAbs
		};

		if (uploadTask.uploader) {
			var uploader = uploadTask.uploader;
			copy.state = uploader.state;
			copy.errorOccursed = uploader.errorOccursed;
			copy.bytesSended = calcBytesSended();
			copy.totalBytes = uploader.totalBytes;
		}

		return copy;

		function calcBytesSended() {
			// 这里是通过查询请求对应的套接字上的属性来实现的
			return uploadTask.uploader.writeStream.socket.bytesWritten;
		}
	}
}

// args
// - uploadTaskId
// res
function start(args, callback) {
	var uploadTaskId,
		uploadTask;

	uploadTaskId = args.uploadTaskId;
	findUploadTaskEx(uploadTaskId, function(_uploadTask) {
		uploadTask = _uploadTask;
		if (uploadTask.uploader) {
			callback({error: 'repetition starting'});
			return;
		}

		var filePathAbs = uploadTask.filePathAbs;
		uploadFile(filePathAbs, uploadFileSuccess, uploadFileFailure);

	}, callback);

	function uploadFileSuccess(uploader) {
		uploadTask.uploader = uploader;
		uploader.start();
		callback({});
	}

	function uploadFileFailure() {
		callback({error: 'unknown'});
	}

}

function cancel(args, callback) {
	var uploadTaskId;

	uploadTaskId = args.uploadTaskId;
	findUploadTaskEx(uploadTaskId, function(uploadTask) {
		uploadTask.uploader.cancel();
		callback({});
	}, callback);
}

function pause(args, callback) {
	var uploadTaskId;

	uploadTaskId = args.uploadTaskId;
	findUploadTaskEx(uploadTaskId, function(uploadTask) {
		uploadTask.uploader.pause();
		callback({});
	}, callback);
}

function resume(args, callback) {
	var uploadTaskId;

	uploadTaskId = args.uploadTaskId;
	findUploadTaskEx(uploadTaskId, function(uploadTask) {
		uploadTask.uploader.resume();
		callback({});
	}, callback);
}

// 内部使用的函数

// 这个函数是在 findUploadTask 的基础上对 fcb
// 的处理有所不同，会在 fcb 中返回 error 因此可以直接对接
// 到客户端的请求上
function findUploadTaskEx(id, scb, fcb) {
	findUploadTask(id, scb, function() {
		fcb({error: 'upload task not found ' + id});
	});
}

// # scb(uploadTask)
// # fcb()
function findUploadTask(id, scb, fcb) {
	uploadTask = uploadTaskHeap[id];
	if (uploadTask) {
		scb(uploadTask);
	} else {
		fcb();
	}
}