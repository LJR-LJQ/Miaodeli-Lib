var fs = require('fs');
var path = require('path');

exports.retriveDirInfo = retriveDirInfo;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function retriveDirInfo(dirPathAbs, scb, tcb, pcb, fcb) {
	// 【参数】
	var basename;
	// 【过程】
	fs.stat(dirPathAbs, function(err, stats){
		if(err || !stats.isDirectory()) {
			fcb();
			return;
		}
		basename = path.basename(dirPathAbs);
		tcb(basename, stats.size, stats.ctime, stats.mtime, stats.atime);
		doRetriveDir(dirPathAbs, function(){
			scb(basename, stats.size, stats.ctime, stats.mtime, stats.atime);
		}, pcb, fcb);
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