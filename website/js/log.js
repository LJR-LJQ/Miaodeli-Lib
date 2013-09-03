function log(type, content) {
	var node = $('<div></div>').text(content).addClass(type);
	$('#log-area').append(node);
}

function logSuccess(content) {
	log('success', content);
}

function logFailure(content) {
	log('failure', content);
}

function logInfo(content) {
	log('info', content);
}