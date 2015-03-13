
var services = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : null,
	credentials = services ? services['redis-2.2'][0]['credentials'] : {
		port: 6379,
		host: '127.0.0.1',
		password: ''
	};

exports.RedisCredentials = credentials;