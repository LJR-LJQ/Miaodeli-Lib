exports.name = 'queryDir() test';
exports.test = test;

var queryDir = require('../lib/queryDir.js').queryDir;

function test(scb, fcb) {
	queryDir('c:/windows/system32', queryDirScb, queryDirFcb);

	function queryDirScb(dirList, fileList) {
		if (Array.isArray(dirList) && Array.isArray(fileList)) {
			printList('[dirList]', dirList);
			printList('[fileList]', fileList);
		} else {
			// 测试失败
			fcb();
		}
	}

	function queryDirFcb() {
		fcb();
	}

	function printList(title, list) {
		console.log(title);
		list.forEach(function(item) {
			console.log(item)
		});
		console.log('');
	}
}

test();