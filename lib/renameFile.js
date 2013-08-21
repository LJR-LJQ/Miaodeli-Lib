var fs = require('fs');
var path = require('path');

exports.renameFile = renameFile;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function renameFile(filePathAbs, newName, scb, fcb) {
	// 【变量】
	var baseName, dirName;

	// 【过程】
	try {
		if(!fs.statSync(filePathAbs).isFile()) {
			throw 'The path is not file.';
		}
	} catch(err) {
		fcb(); // 文件不存在，权限问题，该路径不是有意义的文件
		return;
	}

	baseName = path.basename(filePathAbs);
	dirName = path.dirname(filePathAbs);
	try {
		fs.renameSync(filePathAbs, dirName + '/' + newName);
	} catch(err) {
		fcb();
		return;
	}

	scb(baseName, newName);
}