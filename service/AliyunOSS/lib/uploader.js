exports.create = create;

var safeCall = require('./safeCall').safeCall;

function create(readStream, writeStream) {
	return new Uploader(readStream, writeStream);
}

// # onStart()
// # onSpeed(bytesSended, speed) 每秒传输字节量
// # onStop()
// # onFinish()
// # onError(err)
function Uploader(readStream, writeStream) {
	// 状态说明：
	// 起始状态为 stop
	// stop --start()--> start
	// start --cancel()--> cancel
	// start --pause()--> pause
	// start --*finish--> finish
	// pause --resume()--> start
	// pause --cancel()--> cancel
	// finish 没有转移路径了
	// 注意没有 error 状态
	// 因为关于错误是另外一个独立的状态

	this.state = 'stop';
	this.errorOccursed = false;

	this.readStream = readStream;
	this.writeStream = writeStream;
}

Uploader.prototype.start = function() {
	var self = this;

	if (!this.isStop()) return;
	this.setStart();

	this.readStream.on('data', _onData);
	this.readStream.on('error', _onError);

	this.writeStream.on('finish', _onFinish);
	this.writeStream.on('error', _onError);

	// 开始发送
	this.readStream.pipe(this.writeStream);

	function _onData(chunk) {
		console.log(chunk.length + ' Bytes read');
		
	}

	function _onFinish() {
		self.setFinish();
	}

	function _onError(err) {
		self.errorOccursed = true;
	}
}

Uploader.prototype.pause = function() {
	if (!this.isStart()) return;
	this.setPause();
	this.readStream.pause();
}

Uploader.prototype.resume = function() {
	if (!this.isPause()) return;
	this.setStart();

	this.readStream.resume();
}

Uploader.prototype.cancel = function() {
	if (!(this.isStart() || this.isPause())) return;
	this.setCancel();

	this.readStream.unpipe(this.writeStream);
	// 这里可能还需要停掉 readStream 和结束 writeStream
	// TODO
}

// 用于判断当前状态的一系列函数

Uploader.prototype.isStop = function() {
	return this.state === 'stop';
}

Uploader.prototype.isStart = function() {
	return this.state === 'start';
}

Uploader.prototype.isPause = function() {
	return this.state === 'pause';
}

Uploader.prototype.isCancel = function() {
	return this.state === 'cancel';
}

Uploader.prototype.isFinish = function() {
	return this.state === 'finish';
}

// 用于设定当前状态的一系列函数

Uploader.prototype.setStop = function() {
	this.state = 'stop';
}

Uploader.prototype.setStart = function() {
	this.state = 'start';
}

Uploader.prototype.setPause = function() {
	this.state = 'pause';
}

Uploader.prototype.setCancel = function() {
	this.state = 'cancel';
}

Uploader.prototype.setFinish = function() {
	this.state = 'finish';
}
