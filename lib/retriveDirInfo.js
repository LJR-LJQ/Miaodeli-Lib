var fs = require('fs');
var path = require('path');

exports.retriveDirInfo = retriveDirInfo;

// 【功能】
// 待编写

// 【参数】
// scb(); 函数成功结束后回调
// tcb(basename, stats.ctime, stats.mtime, stats.atime); 函数一开始读取到时间信息时回调
// pcb(totalSize); 函数在读取目录大小过程中的进度报告
// fcb(); 函数出现错误时回调

// 【返回值】
// 待编写

// 【备注】
// 待编写

function retriveDirInfo(dirPathAbs, scb, tcb, pcb, fcb) {
	// 【过程】
	fs.stat(dirPathAbs, function(err, stats){
		if(err || !stats.isDirectory()) {
			fcb();
			return;
		}
		tcb(path.basename(dirPathAbs), stats.ctime, stats.mtime, stats.atime);
		doRetriveDir(dirPathAbs, scb, pcb, fcb);
		return;
	});

	// 【函数】
	function doRetriveDir(dirPathAbs, scb, pcb, fcb, fileQueue, totalSize){
		// 【参数】
		var index;
		// 【过程】
		fileQueue = fileQueue || [];
		totalSize = totalSize || 0;
		fs.readdir(dirPathAbs, function(err, files){
			if(err) {
				doRetriveFile(fileQueue, totalSize, scb, pcb, fcb);
				return;
			}
			for(index = 0; index < files.length; index++) {
				fileQueue.push({
					file: files[index],
					dirPathAbs: dirPathAbs
				});
			}
			doRetriveFile(fileQueue, totalSize, scb, pcb, fcb);
			return;
		});
	}

	function doRetriveFile(fileQueue, totalSize, scb, pcb, fcb){
		// 【参数】
		var file, filePathAbs, stats;
		// 【过程】

		file = fileQueue.shift();
		if(typeof file == 'undefined' || file == 'undefined') {
			scb();
			return;
		}
		filePathAbs = file.dirPathAbs + '/' + file.file;
			
		fs.stat(filePathAbs, function(err, stats){
			if(err) {
				doRetriveFile(fileQueue, totalSize, scb, pcb, fcb);
				return;
			}
			if(stats.isDirectory()) {
				doRetriveDir(filePathAbs, scb, pcb, fcb, fileQueue, totalSize);
			} else if(stats.isFile()) {
				totalSize += stats.size;
				pcb(totalSize);
				doRetriveFile(fileQueue, totalSize, scb, pcb, fcb);
			}
		});
	}
}