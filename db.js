var Promise = require('promise'),
	redis = require('redis'),
	cred = require('./settings').RedisCredentials,
	client = redis.createClient(cred.port, cred.host),
	itemPrefix = "item:";

client.auth(cred.password, function(msg){
	console.log(msg);
});

client.on("error", function(err){
	console.log("Error " + err);
});


var getNexItemIdAsync = function(){
	return new Promise(function(resolve, reject){
		client.incr("next_item_id", function(err, obj){
			if (err) {
				reject(err);
				return;
			}
			resolve(obj);	
		});
	});
};

var getItemInternalAsync = function(key){
	return new Promise(function(resolve, reject){
		client.hgetall(key, function(err, obj){
			if (err || !obj){
				reject(err);
				return;
			}			

			resolve(obj);
		});	
	});
};

var getItemExistsAsync = function(key){
	return new Promise(function(resolve,reject){
		client.hgetall(itemPrefix + key, function(err, obj){
			if ((obj === null) || (obj.length === 0)) resolve();
			else reject();
		});
	});
}

exports.getItemAsync = function(id){
	return getItemInternalAsync(itemPrefix + id).then(function(obj){
		client.HINCRBY(itemPrefix + id, "fetch_count", 1);	
		return obj;
	});
};

exports.deleteItemAsync = function(id){
	return new Promise(function(resolve, reject){
		client.del(itemPrefix + id, function(err, obj){
			console.log('err: ' + err);
			console.log('obj: ' + obj);
			if (err || (obj === 0)){
				reject(err);
				return;
			} 
			resolve();
		});
	});
};

exports.setItemAsync = function(id, url, timeout){
	return getItemExistsAsync(id).then(function(obj){
		return new Promise(function(resolve, reject){
			client.hmset(itemPrefix + id, {
				key: id,
				url : url,
				fetch_count: 0
			}, function(err, obj){
				if (err){
					reject(err);
					return;
				}

				if (timeout){
					client.exprie(itemPrefix + id, timeout);
				}

				resolve(id);
			});
		});
	});
};

exports.getAllItemsAsync = function(){
	return new Promise(function(resolve, reject){
		client.keys(itemPrefix+'*', function(err, keys){
			if (err){
				reject(err);
				return;
			}

			var list = keys.map(function(key){
				return getItemInternalAsync(key).then(function(item){
					return item;
				})
			});

			Promise.all(list).then(function(a){
				resolve(a);
			});
		});
	});
};



