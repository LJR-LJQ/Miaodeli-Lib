var child_process = require('child_process');

exports.captureScreen = captureScreen;

// 【功能】
// 待编写

// 【参数】
// 待编写

// 【返回值】
// 待编写

// 【备注】
// 待编写

function captureScreen(filePathAbs, scb, fcb) {
	// 【参数】
	var platformMap;
	// 【过程】
	platformMap = {};
	platformMap['win32'] = '"../bin/nircmdc.exe" savescreenshot "' + filePathAbs + '"';
	platformMap['linux'] = 'screencapture "' + filePathAbs + '"';
	platformMap['darwin'] = 'import -window root "' + filePathAbs + '"';
	platformMap['freebsd'] = '';
	platformMap['sunos'] = '';

	
	child_process.exec(platformMap[process.platform], {env: process.env}, function(err, stdout, stderr){
		if(err) {
			console.log(err);
			fcb();
			return;
		}
		scb();
		return;
	});
}