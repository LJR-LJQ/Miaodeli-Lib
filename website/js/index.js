function clickCreateTask() {
	var filePathAbs = $('#create-upload-task-path')[0].value;
	logInfo('create task: ' + filePathAbs);
	rpc('AliyunOSS.createUploadTask', {filePathAbs: filePathAbs}, createUploadTask_success, createUploadTask_failure);

	function createUploadTask_success(result) {
		logSuccess('create task ok: ' + result.uploadTaskId);
	}

	function createUploadTask_failure(err) {
		logFailure('create task failed: ' + err.error);
	}
}

function clickDeleteTask() {
	var id = $('#delete-upload-task-id')[0].value;
	logInfo('delete task: ' + id);
	rpc('AliyunOSS.deleteUploadTask', {uploadTaskId: id}, deleteUploadTask_success, deleteUploadTask_failure);

	function deleteUploadTask_success(result) {
		logSuccess('delete task ok: ' + result.uploadTaskId);
	}

	function deleteUploadTask_failure(err) {
		logFailure('delete task "' + id + '" failed: ' + err.error);
	}
}

function clickQueryTask() {
	var id = $('#query-upload-task-id')[0].value;
	var tbody = $('#query-upload-task-output').empty();
	logInfo('query task: ' + id);
	rpc('AliyunOSS.queryUploadTask', {uploadTaskId: id}, queryUploadTask_success, queryUploadTask_failure);

	function queryUploadTask_success(result) {
		logSuccess('query task ok: ' + id);

		for(var name in result) {
			var tr = $('<tr></tr>')
						.append($('<td></td>').text(name))
						.append($('<td></td>').text(result[name]));
			tbody.append(tr);
		}
	}

	function queryUploadTask_failure(err) {
		logFailure('query task failed: ' + err.error);
	}
}

function clickStart() {
	var id = $('#control-upload-task-id').val();
	logInfo('start task: ' + id);
	rpc('AliyunOSS.start', {uploadTaskId: id}, start_success, start_failure);

	function start_success(result) {
		logSuccess('start task ok: ' + id);
	}

	function start_failure(err) {
		logFailure('start task failed: ' + err.error);
	}
}

function clickPause() {
	alert('pause');
}

function clickResume() {
	alert('resume');
}

function clickCancel() {
	alert('cancel');
}