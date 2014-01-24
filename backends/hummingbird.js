var net = require('net'),
util = require('util'),
http = require('http'),
url = require('url');

var debug;
var host;
var _status;

var onFlush = function(time_stamp, metrics) {
	console.log(metrics);
	
	var data = [];

	// for(var key in metrics.gauges) {
	// 	var g = metrics.gauges[key];
	// 	client.gauge(key, g);
	// }

	// for(var key in metrics.timers) {
	// 	var t = metrics.timers[key];
	// 	t.forEach(function(v) {
	// 		client.timing(key, v);
	// 	});
	// }

	for(var key in metrics.counters) {
		data.push(key+'='+metrics.counters[key]);
	}
};

var doRequest(data) {
	var options = url.parse(host+'?'+data.join('&'));
	options.method = 'GET';
	options.headers = {'Content-Length': 0};

	try {
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			_status.last_exception = Math.round(new Date().getTime() / 1000);
		});

		req.on('close', function(e){
			_status.flush_time = (Date.now() - starttime);
			_status.flush_length = data.length;
			_status.last_flush = Math.round(new Date().getTime() / 1000);
		});

		//req.write(data);
		req.end();
	}
	catch(e) {
	  	if (debug) {
	  		util.log(e);
	  	}
	  	_status.last_exception = Math.round(new Date().getTime() / 1000);
	}
}

var onStatus = function(callback) {

};

exports.init = function(startup_time, config, events) {
	if(!config.bridgeURL) {
		util.log('statsd-hummingbird-backend: requires \'bridgeURL\' option');
		return false;
	}

	host = config.bridgeURL;
	debug = config.statsdDebug || false;
	_status = {};

	events.on('flush', onFlush);
	events.on('status', onStatus);

	return true;
};