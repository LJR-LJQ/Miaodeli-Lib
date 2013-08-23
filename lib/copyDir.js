var fs = require('fs');

exports.copyDir = copyDir;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function copyDir(srcDirPathAbs, targetDirPathAbs, scb, fcb) {
	// 【过程】
	try {
		if(!fs.statSync(srcDirPathAbs).isDirectory()) {
			throw 'The path is not a directory';
		}
	} catch(err) {
		fcb(); // 目录不存在，权限问题，该路径不是有意义的目录；
		return;
	}

	fs.exists(targetDirPathAbs, function(exists){
		if (exists) {
			fcb(); // 同名文件或目录已存在
			return;
		} else {
			doCopy(srcDirPathAbs, targetDirPathAbs, scb, fcb);
		}
	});

	// 【函数】
	function doCopy(srcDirPathAbs, targetDirPathAbs, scb, fcb){
		// 【参数】
		var index, files, file, srcFilePathAbs, targetFilePathAbs, readStream, writeStream;
		// 【过程】
		fs.mkdirSync(targetDirPathAbs);
		var files = fs.readdirSync(srcDirPathAbs);
		for(index = 0; index < files.length; index++) {
			file = files[index];
			try {
				srcFilePathAbs = srcDirPathAbs + '/' + file;
				targetFilePathAbs = targetDirPathAbs + '/' + file;
				if(fs.statSync(srcFilePathAbs).isDirectory()) {
					doCopy(srcFilePathAbs, targetFilePathAbs, function(){}, function(){});
				} else {
					readStream = fs.createReadStream(srcFilePathAbs);
					writeStream = fs.createWriteStream(targetFilePathAbs);
					readStream.pipe(writeStream);
				}
			} catch(err) {
				console.log(err);
				fcb();
				return;
			}
		}
		scb(srcDirPathAbs, targetDirPathAbs);
	}
}