var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var User = sequelize.define('users', {
        
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        socketId: DataTypes.STRING,
        userGenre: DataTypes.STRING,
        userLocation: DataTypes.STRING,
        status: DataTypes.STRING,
        userColour: DataTypes.STRING,
        inChannels: DataTypes.STRING,
        currentChannel: DataTypes.STRING,
        userContacts: DataTypes.STRING
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    User.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(user_id, onSuccess, onError) {
                    User.findAll({where: {id: user_id }})
                       .success(onSuccess).error(onError);
                },
              
                retrieveById: function(user_id, onSuccess, onError) {
                    User.find({where: {id: user_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                retrieveByEmail: function(user_email, onSuccess, onError) {
 
                    User.find({where: {email: user_email}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                retrieveByUsername: function(user_name, onSuccess, onError) {
                    User.find({where: {username: user_name}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                retrieveByEmailAndPassword: function(user_email, user_password, onSuccess, onError) {
 
                    User.find({where: {email: user_email, password: user_password}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                add: function(onSuccess, onError) {
                    
                    var email = this.email;
                    var socketId = this.socketId;
                    var status = this.status;
                    var userColour = this.userColour;
                
                    User.build({
                                email: email,
                               socketId: socketId,
                               status: status,
                               userColour: userColour
                               })
                            .save().success(onSuccess).error(onError);
                },
                
                updateUsernameById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var username = this.username;

                    User.update({
                                username: username
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateUserGenreById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var userGenre = this.userGenre;

                    User.update({
                                userGenre: userGenre
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateUserLocationById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var userLocation = this.userLocation;

                    User.update({
                                userLocation: userLocation
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateUserPasswordById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var password = this.password;

                    User.update({
                                password: password
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var username = this.username;
                    var socketId = this.socketId;
                    var status = this.status;
                    var inChannels = this.inChannels;
                    var currentChannel = this.currentChannel;

                    //var shasum = crypto.createHash('sha1');
                    //shasum.update(password);
                    //password = shasum.digest('hex');
                    
                    User.update({
                                socketId: socketId,
                                 status: status,
                                 inChannels: inChannels,
                                 currentChannel: currentChannel
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateContacts: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var userContacts = this.userContacts;
                    
                    //var shasum = crypto.createHash('sha1');
                    //shasum.update(password);
                    //password = shasum.digest('hex');
                    
                    User.update({
                               userContacts: userContacts
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateByIdFull: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var username = this.username;
                    var socketId = this.socketId;
                    var status = this.status;
                    var inChannels = this.inChannels;
                    var currentChannel = this.currentChannel;
                    var userGenre = this.userGenre;
                    var userLocation = this.userLocation;
                    var email = this.email;
                    var password = this.password;
                    
                    //var shasum = crypto.createHash('sha1');
                    //shasum.update(password);
                    //password = shasum.digest('hex');
                    
                    User.update({
                                socketId: socketId,
                                 userGenre: userGenre,
                                 userLocation: userLocation,
                                 email: email,
                                 password: password,
                                 status: status,
                                 inChannels: inChannels,
                                 currentChannel: currentChannel
                                 }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                updateBySocketId: function(socketId, onSuccess, onError) {
                      
                    var username = this.username;
                     var status = this.status;
                                            
                     User.update({ status: status }, {socketId: socketId} )
                            .success(onSuccess).error(onError);
                },
               
                removeById: function(user_id, onSuccess, onError) {
                    User.destroy({id: user_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = User;
    