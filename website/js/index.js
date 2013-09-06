function clickCreateDir() {
	var dirPathAbs = $('#create-dir-dirPathAbs').val();
	var dirName = $('#create-dir-dirName').val();

	logInfo('[create dir]');
	logInfo('dirPathAbs: ' + dirPathAbs);
	logInfo('dirName: ' + dirName);

	rpc('Directory.create', {
		dirPathAbs: dirPathAbs,
		dirName: dirName
	}, SuccessFactory('create dir'), FailureFactory('create dir'));
}

function clickDeleteDir() {
	var dirPathAbs = $('#delete-dir-dirPathAbs').val();

	logInfo('[delete dir]');
	logInfo('dirPathAbs: ' + dirPathAbs);

	rpc('Directory.delete', {
		dirPathAbs: dirPathAbs
	}, SuccessFactory('delete dir'), FailureFactory('delete dir'));
}

function clickRenameDir() {
	var dirPathAbs = $('#rename-dir-dirPathAbs').val();
	var newName = $('#rename-dir-newName').val();

	logInfo('[rename dir]');
	logInfo('dirPathAbs: ' + dirPathAbs);
	logInfo('newName: ' + newName);

	rpc('Directory.rename', {
		dirPathAbs: dirPathAbs,
		newName: newName
	}, SuccessFactory('rename dir'), FailureFactory('rename dir'));
}

function clickCopyDir() {
	var srcDirPathAbs = $('#copy-dir-srcDirPathAbs').val();
	var targetDirPathAbs = $('#copy-dir-targetDirPathAbs').val();

	logInfo('[copy dir]');
	logInfo('srcDirPathAbs: ' + srcDirPathAbs);
	logInfo('targetDirPathAbs: ' + targetDirPathAbs);

	rpc('Directory.copy', {
		srcDirPathAbs: srcDirPathAbs,
		targetDirPathAbs: targetDirPathAbs
	}, SuccessFactory('copy dir'), FailureFactory('copy dir'));
}

function clickMoveDir() {
	var srcDirPathAbs = $('#move-dir-srcDirPathAbs').val();
	var targetDirPathAbs = $('#move-dir-targetDirPathAbs').val();

	logInfo('[move dir]');
	logInfo('srcDirPathAbs: ' + srcDirPathAbs);
	logInfo('targetDirPathAbs: ' + targetDirPathAbs);

	rpc('Directory.move', {
		srcDirPathAbs: srcDirPathAbs,
		targetDirPathAbs: targetDirPathAbs
	}, SuccessFactory('move dir'), FailureFactory('move dir'));
}

function clickCreateFile() {
	var dirPathAbs = $('#create-file-dirPathAbs').val(),
		fileName =  $('#create-file-fileName').val();

	logInfo('[create file]');
	logInfo('dirPathAbs: ' + dirPathAbs);
	logInfo('fileName: ' + fileName);

	rpc('File.create', {
		dirPathAbs: dirPathAbs, fileName: fileName
	}, SuccessFactory('create file'), FailureFactory('create file'));
}

function clickDeleteFile() {
	var filePathAbs = $('#delete-file-filePathAbs').val();

	logInfo('[delete file]');
	logInfo('filePathAbs: ' + filePathAbs);

	rpc('File.delete', {
		filePathAbs: filePathAbs
	}, SuccessFactory('delete file'), FailureFactory('delete file'));
}

function clickRenameFile() {
	var filePathAbs = $('#rename-file-filePathAbs').val(),
		newName = $('#rename-file-newName').val();

	logInfo('[rename file]');
	logInfo('filePathAbs: ' + filePathAbs);
	logInfo('newName: ' + newName);

	rpc('File.rename', {
		filePathAbs: filePathAbs,
		newName: newName
	}, SuccessFactory('rename file'), FailureFactory('rename file'));
}

function clickCopyFile() {
	var srcFilePathAbs = $('#copy-file-srcFilePathAbs').val(),
		targetFilePathAbs = $('#copy-file-targetFilePathAbs').val();

	logInfo('[copy file]');
	logInfo('srcFilePathAbs: ' + srcFilePathAbs);
	logInfo('targetFilePathAbs: ' + targetFilePathAbs);

	rpc('File.copy', {
		srcFilePathAbs: srcFilePathAbs,
		targetFilePathAbs: targetFilePathAbs
	}, SuccessFactory('copy file'), FailureFactory('copy file'));
}

function clickMoveFile() {
	var srcFilePathAbs = $('#move-file-srcFilePathAbs').val(),
		targetFilePathAbs = $('#move-file-targetFilePathAbs').val();

	logInfo('[move file]');
	logInfo('srcFilePathAbs: ' + srcFilePathAbs);
	logInfo('targetFilePathAbs: ' + targetFilePathAbs);

	rpc('File.move', {
		srcFilePathAbs: srcFilePathAbs,
		targetFilePathAbs: targetFilePathAbs
	}, SuccessFactory('move file'), FailureFactory('move file'));
}

function clickCaptureScreen() {
	var filePathAbs = $('#capture-screen-input').val();
	if (!filePathAbs) return;
	logInfo('capture screen: ' + filePathAbs);
	rpc('RemoteControl.captureScreen', {filePathAbs: filePathAbs}, success, failure);

	function success(result) {
		logSuccess('capture screen ok: ' + filePathAbs);
	}

	function failure(err) {
		logFailure('capture screen failed: ' + err.error);
	}
}

function clickShutdown() {
	logInfo('shutdown');
	rpc('RemoteControl.shutdown', {}, success, failure);

	function success(result) {
		logSuccess('shutdown ok');
	}

	function failure(err) {
		logFailure('shutdown failed: ' + err.error);
	}
}

function clickReboot() {
	logInfo('reboot');
	rpc('RemoteControl.reboot', {}, success, failure);

	function success(result) {
		logSuccess('reboot ok: ');
	}

	function failure(err) {
		logFailure('reboot failed: ' + err.error);
	}
}

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
	var id = $('#control-upload-task-id').val();
	logInfo('pause task: ' + id);
	rpc('AliyunOSS.pause', {uploadTaskId: id}, pause_success, pause_failure);

	function pause_success(result) {
		logSuccess('pause task ok: ' + id);
	}

	function pause_failure(err) {
		logFailure('pause task failed: ' + err.error);
	}
}

function clickResume() {
	var id = $('#control-upload-task-id').val();
	logInfo('resume task: ' + id);
	rpc('AliyunOSS.resume', {uploadTaskId: id}, resume_success, resume_failure);

	function resume_success(result) {
		logSuccess('resume task ok: ' + id);
	}

	function resume_failure(err) {
		logFailure('resume task failed: ' + err.error);
	}
}

function clickCancel() {
	var id = $('#control-upload-task-id').val();
	logInfo('cancel task: ' + id);
	rpc('AliyunOSS.cancel', {uploadTaskId: id}, cancel_success, cancel_failure);

	function cancel_success(result) {
		logSuccess('cancel task ok: ' + id);
	}

	function cancel_failure(err) {
		logFailure('cancel task failed: ' + err.error);
	}
}

function SuccessFactory(title) {
	return function() {
		logSuccess('[' + title + '] successed');
	}
}

function FailureFactory(title) {
	return function(err) {
		logFailure('[' + title + '] failed: ' + err.error);
	}
}