var express = require('express'),
	bodyParser = require('body-parser'),
	port = process.env.VCAP_APP_PORT || 3001,
	app = express(),
	router = express.Router(),
	db = require("./db.js");
 
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());
 
router.use(function(req, res, next) {
    console.log('Incomming: ' + req.originalUrl);
    next(); 
});

router.route('/')
	.get(function(req, res){
		db.getAllItemsAsync().then(function(obj){
			console.log(obj);
			res.json(obj);	
		}).catch(function(err){
			res.status(401).json(err);
		});
	})
	.post(function(req, res){
		var body = req.body;
		db.setItemAsync(body.id, body.url, body.timout).then(function(id){
			res.json({
				url: body.url,
				key: id
			});
		}).catch(function(err){
			res.status(409).json({
				message: body.id + ' in use'
			});
		});
	});


router.route('/:id')
	.get(function(req, res){
		var id = req.params.id;
		db.getItemAsync(id).then(function(obj){
			res.redirect(302, obj.url);
		}).catch(function(err){
			res.status(404).json(err);
		})
	})
	.delete(function(req, res){
		var id = req.params.id;
		db.deleteItemAsync(id).then(function(obj){
			res.status(204).end();
		}).catch(function(err){
			res.status(404).end();
		})
	});

app.use('/', router); 

app.listen(port);
console.log("listening on port " + port);

