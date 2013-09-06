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
	var platformMap, nircmd;
	// 【过程】
	platformMap = {};
	//platformMap['win32'] = '"../bin/nircmdc.exe" savescreenshot "' + filePathAbs + '"';
	platformMap['linux'] = 'screencapture "' + filePathAbs + '"';
	platformMap['darwin'] = 'import -window root "' + filePathAbs + '"';
	platformMap['freebsd'] = '';
	platformMap['sunos'] = '';

	if('win32' == process.platform) {
		console.log('win32');
		nircmd = child_process.spawn('../bin/nircmdc.exe', ["savescreenshot", filePathAbs], {env: process.env});
		nircmd.stderr.on('data', function(data){
			fcb();
			return;
		});
		nircmd.on('error', function (err) {
			if (err) {
				fcb();
				return;
			}
		});
		nircmd.on('close', function (code) {
			if (code !== 0) {
				scb();
				return;
			}
		});
	} else {
		child_process.exec(platformMap[process.platform], {env: process.env}, function(err, stdout, stderr){
			if(err) {
				fcb();
				return;
			}
			scb();
			return;
		});
	}
}

// 【测试】
captureScreen('c:/zzz.png', function(){
	console.log('suc');
}, function(){
	console.log('err');
});
