var fs = require('fs');
var path = require('path');

exports.calculateDirSize = calculateDirSize;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function calculateDirSize(dirPathAbs, scb, pcb, fcb) {
	// 【过程】
	fs.stat(dirPathAbs, function(err, stats){
		if(err || !stats.isDirectory()) {
			fcb();
			return;
		}
		doRetriveDir(dirPathAbs, function(totalFileSize, totalFileCount){
			scb(path.basename(dirPathAbs), totalFileSize, totalFileCount);
		}, pcb, fcb);
		return;
	});

	// 【函数】
	function doRetriveDir(dirPathAbs, scb, pcb, fcb, fileQueue, currentFileSize, currentFileCount){
		// 【参数】
		var index;
		// 【过程】
		fileQueue = fileQueue || [];
		currentFileSize = currentFileSize || 0;
		currentFileCount = currentFileCount || 0;
		fs.readdir(dirPathAbs, function(err, files){
			if(err) {
				doRetriveFile(fileQueue, currentFileSize, scb, pcb, fcb);
				return;
			}
			for(index = 0; index < files.length; index++) {
				fileQueue.push({
					file: files[index],
					dirPathAbs: dirPathAbs
				});
			}
			doRetriveFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
			return;
		});
	}

	function doRetriveFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb){
		// 【参数】
		var file, filePathAbs, stats;
		// 【过程】

		file = fileQueue.shift();
		if(typeof file == 'undefined' || file == 'undefined') {
			scb(currentFileSize, currentFileCount);
			return;
		}
		filePathAbs = file.dirPathAbs + '/' + file.file;
			
		fs.stat(filePathAbs, function(err, stats){
			if(err) {
				doRetriveFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
				return;
			}
			if(stats.isDirectory()) {
				doRetriveDir(filePathAbs, scb, pcb, fcb, fileQueue, currentFileSize);
			} else if(stats.isFile()) {
				currentFileSize += stats.size;
				currentFileCount += 1;
				pcb(currentFileSize, currentFileCount);
				doRetriveFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
			}
		});
	}
}