var net = require('net'),
util = require('util'),
http = require('http'),
url = require('url');

var debug;
var host;
var metricCut = 3;

var onFlush = function(time_stamp, metrics) {
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
		var ksplit = key.split('.');
		var newkey = ksplit.slice(ksplit.length - metricCut,ksplit.length).join('.');
		if ("undefined" == typeof data[newkey]) data[newkey] = 0;
		data[newkey] += metrics.counters[key];
	}

	var s = [];
	for (key in data) {
		if (data[key] > 0) s.push(key+'='+data[key]);
	}
	doRequest(s);
};

var doRequest = function(data) {
	try {

		var options = url.parse(host+'?'+data.join('&'));
		options.method = 'GET';
		options.headers = {'Content-Length': 0};

		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});

		req.on('close', function(e){
		});

		//req.write(data);
		req.end();
	}
	catch(e) {
	  	if (debug) {
	  		util.log(e);
	  	}
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

	events.on('flush', onFlush);
	events.on('status', onStatus);

	return true;
};