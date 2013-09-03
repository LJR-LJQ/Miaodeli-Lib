exports.serviceName = 'AliyunOSS';
exports.createUploadTask = createUploadTask;
exports.deleteUploadTask = deleteUploadTask;
exports.queryUploadTask = queryUploadTask;
exports.start = start;
exports.pause = pause;
exports.resume = resume;
exports.stop = stop;

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
		// 找到了，直接把整个任务信息返回
		callback(uploadTask);
	}, callback);
}

// args
// - uploadTaskId
// res
function start(args, callback) {
	callback({});
}

function stop(args, callback) {
	callback({});
}

function pause(args, callback) {
	callback({});
}

function resume(args, callback) {
	callback({});
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