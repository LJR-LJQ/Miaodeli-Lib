var fs = require('fs');

exports.deleteDir = deleteDir;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function deleteDir(dirPathAbs, scb, fcb) {
	// 【过程】
	fs.stat(dirPathAbs, function(err, stats){
		if(err || !stats.isDirectory()) {
			fcb();
			return;
		}
		doDelete(dirPathAbs, scb, fcb);
	});

	// 【函数】
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