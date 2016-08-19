var config = require('./config');

var bodyParser = require('body-parser');
var apiApp = require("./app.js");
var api = apiApp.api;

/*var errorHandler = function (req, res, next) { console.log('api app error'); }
api.use(errorHandler);

api.use(bodyParser());
api.use(bodyParser.urlencoded({
  extended: true
}));*/

api.listen(3000);

var fs = require('fs');
var path = require("path");
var mime = require('mime');
var sanitize = require("sanitize-filename");

    //FILE TRANSFER//
    api.get('/api/download', function (req, res) {
        
        var requestedFile = decodeURIComponent(req.query.file);
       
        var file = config.filePaths.uploadDir + "/" + requestedFile;
    
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
    
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
    
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      
    });


    // IMPORT MODELS
    // =============================================================================
    var User = require("./models/user.js");
    
    // ----------------------------------------------------
    
    api.post('/api/users', function (req, res) {

        console.log('user post');
        console.log(req.body);
        
        var user = User.build();
	var username = req.body.username; //bodyParser does the magic
	
	var user = User.build({ username: username });

	user.add(function(success){
		res.json({ message: "User created!" });
	},
	function(err) {
		res.send(err);
	});
    });
    
    // get all the users (accessed at GET http://localhost:8080/api/users)
    api.get('/api/users', function (req, res) {
            var user = User.build();
            
            user.retrieveAll(function(users) {
                    if (users) {				
                      res.json(users);
                    } else {
                      res.send(401, "User not found");
                    }
              }, function(error) {
                    res.send("User not found");
              });
    });
    
    api.put('/api/users/:user_id', function (req, res) {
    // update a user (accessed at PUT http://localhost:8080/api/users/:user_id)
        console.log(req.params.user_id);
            var user = User.build();	
              
            user.username = req.body.username;
            
            user.updateById(req.params.user_id, function(success) {
                    console.log(success);
                    if (success) {	
                            res.json({ message: 'User updated!' });
                    } else {
                      res.send(401, "User not found");
                    }
              }, function(error) {
                    res.send("User not found");
              });
    });
    
    // get a user by id(accessed at GET http://localhost:8080/api/users/:user_id)
    api.get('/api/users/:user_id', function (req, res) {
            var user = User.build();
            
            user.retrieveById(req.params.user_id, function(users) {
                    if (users) {				
                      res.json(users);
                    } else {
                      res.send(401, "User not found");
                    }
              }, function(error) {
                    res.send("User not found");
              });
    });
    
    // delete a user by id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    api.delete('/api/users/:user_id', function (req, res) {
            var user = User.build();
            
            user.removeById(req.params.user_id, function(users) {
                    if (users) {				
                      res.json({ message: 'User removed!' });
                    } else {
                      res.send(401, "User not found");
                    }
              }, function(error) {
                    res.send("User not found");
              });
    });
    