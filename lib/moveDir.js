var fs = require('fs');

exports.moveDir = moveDir;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function moveDir(srcDirPathAbs, targetDirPathAbs, scb, fcb) {
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
				doCopyDir(srcDirPathAbs, targetDirPathAbs, function(){
					doDelete(srcDirPathAbs, function(){
						scb(srcDirPathAbs, targetDirPathAbs);
						return;
					}, fcb);
				}, fcb);
			}
		});
	});

	// 【函数】
	function doCopyDir(srcDirPathAbs, targetDirPathAbs, scb, fcb, fileQueue){
		// 【参数】
		var index;
		// 【过程】
		fileQueue = fileQueue || [];
		fs.mkdir(targetDirPathAbs, 0777, function(err){
			if(err) {
				fcb();
				return;
			}
			fs.readdir(srcDirPathAbs, function(err, files){
				if(err) {
					fcb();
					return;
				}
				for(index = 0; index < files.length; index++) {
					fileQueue.push({
						file: files[index],
						srcDirPathAbs: srcDirPathAbs,
						targetDirPathAbs: targetDirPathAbs
					});
				}
				doCopyFile(fileQueue, scb, fcb);
				return;
			});
		});

		
	}

	function doCopyFile(fileQueue, scb, fcb){
		// 【参数】
		var file, srcFilePathAbs, targetFilePathAbs, readStream, writeStream;
		// 【过程】

		file = fileQueue.shift();
		if(typeof file == 'undefined' || file == 'undefined') {
			scb();
			return;
		}

		srcFilePathAbs = file.srcDirPathAbs + '/' + file.file;
		targetFilePathAbs = file.targetDirPathAbs + '/' + file.file;

		fs.stat(srcFilePathAbs, function(err, stats){
			if(err) {
				fcb();
				return;
			}
			if(stats.isDirectory()) {
				doCopyDir(srcFilePathAbs, targetFilePathAbs, scb, fcb, fileQueue);
			} else if(stats.isFile()) {
				readStream = fs.createReadStream(srcFilePathAbs);
				writeStream = fs.createWriteStream(targetFilePathAbs);
				readStream.pipe(writeStream);
				readStream.on('end', function(chunk) {
					doCopyFile(fileQueue, scb, fcb);
				});
			}
		});
	}

	function doDelete(dirPathAbs, scb, fcb) {
		// 【参数】
		var index, files, file, filePathAbs;
		// 【过程】
		try {
			files = fs.readdirSync(dirPathAbs);
			for(index = 0; index < files.length; index++) {
				file = files[index];
				filePathAbs = dirPathAbs + '/' + file;
				if(fs.statSync(filePathAbs).isDirectory()) {
					doDelete(filePathAbs, function(){}, function(){});
				} else {
					fs.unlinkSync(filePathAbs);
				}
			}
			fs.rmdirSync(dirPathAbs);
		} catch(err) {
			fcb();
			return;
		}
		
		scb(dirPathAbs);
		return;
	}
}