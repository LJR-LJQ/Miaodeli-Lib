var fs = require('fs');

exports.copyDir = copyDir;

// 【功能】
// 待编写

// 【参数】
// pcb(srcFilePathAbs, targetFilePathAbs, currentFileSize, currentFileCount);
// scb(currentFileSize, currentFileCount);

// 【返回值】
// 待编写

// 【备注】
// 待编写

function copyDir(srcDirPathAbs, targetDirPathAbs, scb, pcb, fcb) {
	// 【过程】
	fs.stat(srcDirPathAbs, function(err, stats){
		if(err || !stats.isDirectory()) {
			fcb();
			return;
		}
		fs.exists(targetDirPathAbs, function(exists){
			if (exists) {
				fcb(); // 同名文件或目录已存在
				return;
			} else {
				doCopyDir(srcDirPathAbs, targetDirPathAbs, scb, pcb, fcb);
			}
		});
	});

	// 【函数】
	function doCopyDir(srcDirPathAbs, targetDirPathAbs, scb, pcb, fcb, fileQueue, currentFileSize, currentFileCount){
		// 【参数】
		var index;
		// 【过程】
		fileQueue = fileQueue || [];
		currentFileSize = currentFileSize || 0;
		currentFileCount = currentFileCount || 0;
		fs.mkdir(targetDirPathAbs, 0777, function(err){
			if(err) {
				doCopyFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
				return;
			}
			fs.readdir(srcDirPathAbs, function(err, files){
				if(err) {
					doCopyFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
					return;
				}
				for(index = 0; index < files.length; index++) {
					fileQueue.push({
						file: files[index],
						srcDirPathAbs: srcDirPathAbs,
						targetDirPathAbs: targetDirPathAbs
					});
				}
				doCopyFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
				return;
			});
		});

		
	}

	function doCopyFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb){
		// 【参数】
		var file, srcFilePathAbs, targetFilePathAbs, readStream, writeStream;
		// 【过程】

		file = fileQueue.shift();
		if(typeof file == 'undefined' || file == 'undefined') {
			scb(currentFileSize, currentFileCount);
			return;
		}

		srcFilePathAbs = file.srcDirPathAbs + '/' + file.file;
		targetFilePathAbs = file.targetDirPathAbs + '/' + file.file;

		fs.stat(srcFilePathAbs, function(err, stats){
			if(err) {
				doCopyFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
				return;
			}
			if(stats.isDirectory()) {
				doCopyDir(srcFilePathAbs, targetFilePathAbs, scb, fcb, fileQueue, currentFileSize, currentFileCount);
			} else if(stats.isFile()) {
				readStream = fs.createReadStream(srcFilePathAbs);
				writeStream = fs.createWriteStream(targetFilePathAbs);
				readStream.pipe(writeStream);
				readStream.on('end', function(chunk) {
					currentFileSize += stats.size;
					currentFileCount += 1;
					pcb(srcFilePathAbs, targetFilePathAbs, currentFileSize, currentFileCount);
					doCopyFile(fileQueue, currentFileSize, currentFileCount, scb, pcb, fcb);
				});
			}
		});
	}
}