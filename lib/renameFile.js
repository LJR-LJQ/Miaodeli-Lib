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
	var stat, dirName, baseName;

	// 【过程】
	try {
		stat = fs.statSync(filePathAbs);
	} catch(err) {
		fcb(); // 文件不存在，权限问题
		return;
	}
	if(!stat.isFile()) {
		fcb(); // 该路径不是有意义的文件
		return;
	}
	dirName = path.dirname(filePathAbs);
	baseName = path.basename(filePathAbs);
	fs.renameSync(filePathAbs, dirName + '/' + newName);

	scb(baseName, newName);
}

/*
// 【测试】
renameFile('c:/newName', 'newName.bmp', function(oldFileName, newFileName){
	console.log(oldFileName);
	console.log(newFileName);
}, function(){
	console.log('err');
});