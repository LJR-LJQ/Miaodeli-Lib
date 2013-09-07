exports.uploadFile = uploadFile;

var fs = require('fs'),
	path = require('path');

var safeCall = require('./safeCall').safeCall,
	putObject = require('./putObject').putObject,
	fileMd5 = require('./fileMd5').fileMd5,
	Uploader = require('./uploader'),
	remoteAuthorize = require('./remoteAuthorize').remoteAuthorize;

// # scb(uploader)
// # fcb()
// 
// uploader
// - start()
// - stop()
// - finish 回调函数
// - working 布尔值
// - uploadedBytes 数值
// - totalBytes 数值
function uploadFile(fileName, scb, fcb) {
	// 首先计算一下文件的 MD5 值，顺便也能够获得文件大小
	fileMd5(fileName, fileMd5Scb, fcb);

	function fileMd5Scb(md5HexText, fileSize) {

		// var info = {
		// 	verb: 'PUT',
		// 	contentMd5: md5HexText,
		// 	contentType: 'application/octet-stream',
		// 	date: (new Date()).toGMTString(),
		// 	canonicalizedOSSHeaders: '',
		// 	canonicalizedResource: getCanonicalizedResource(req)
		// };

		// 根据规范需要填写填写请求中的各个部分
		var totalBytes = fileSize;
		var objectName = path.basename(fileName);
		var bucketName = 'miaodeli-oss';
		var contentType = 'application/octet-stream';
		var gmtDate = (new Date()).toGMTString();

		var req = putObject({
			objectName: objectName,
			bucketName: bucketName,
			contentType: contentType,
			gmtDate: gmtDate,
			contentLength: totalBytes
		});
		
		// 补充 MD5 部分
		req.setHeader('Content-MD5', md5HexText);

		// 请求构造好了，需要签名一下
		signReq(req, md5HexText, signSuccess, signFailure);

		function signSuccess(req) {
			var fileReadStream = fs.createReadStream(fileName);
			var uploader = Uploader.create(fileReadStream, req);
			// 补充一个 totalBytes 属性，用于描述文件尺寸
			uploader.totalBytes = fileSize;
			safeCall(scb, [uploader]);
		}

		function signFailure() {
			safeCall(fcb);
		}
	}
}


// # scb(req)
// # fcb()
function signReq(req, contentMd5, scb, fcb) {
	var obj = {
		verb: req.method,
		contentMd5: contentMd5,
		contentType: req.getHeader('content-type'),
		date: req.getHeader('date'),
		canonicalizedOSSHeaders: getCanonicalizedOSSHeaders(req),
		canonicalizedResource: getCanonicalizedResource(req)
	};

	remoteAuthorize('http://miaodeli.com', obj, remoteAuthorizeSuccess, remoteAuthorizeFailure);

	function remoteAuthorizeSuccess(auth) {
		if (auth.error) {
			safeCall(fcb);
			return;
		}

		req.setHeader('Authorization', auth.Authorization);

		// 通知上级已经完成签名
		safeCall(scb, [req]);
	}

	function remoteAuthorizeFailure() {
		safeCall(fcb);
	}
}

function getCanonicalizedOSSHeaders(req) {
	var ossHeaderList = [],
		_headers = req._headers || {};

	// _headers 中字段名全部都是小写的，因此不用我们转换
	for (var header in _headers) {
		if (/^x-oss-/.test(header)) {
			// 只需把名字加入集合即可，值一会儿再取
			ossHeaderList.push(header);
		}
	}

	if (ossHeaderList.length < 1) return '';

	// 排序一下
	ossHeaderList = ossHeaderList.sort();

	// 开始构造最终的字符串了
	ossHeaderList = ossHeaderList.map(function(header) {
		return header + ':' + _headers[header] + '\n';
	});

	return ossHeaderList.join('');
}

function getCanonicalizedResource(req) {
	// 这里的实现不完整，只能应付一小部分情况
	var host = req.getHeader('host');
	var reqPath = req.path;
	var result = '/' + host.substring(0, host.indexOf('.')) + reqPath;
	return result;
}