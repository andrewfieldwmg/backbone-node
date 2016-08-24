var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var User = sequelize.define('users', {
        
        username: DataTypes.STRING,
        socketId: DataTypes.STRING,
        status: DataTypes.STRING
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
              
                add: function(onSuccess, onError) {
                    
                    var username = this.username;
                    var socketId = this.socketId;
                    var status = this.status;
                
                    User.build({ username: username, socketId: socketId, status: status })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var username = this.username;
                     var socketId = this.socketId;
                     var status = this.status;
                                            
                     User.update({ socketId: socketId, status: status }, {id: id} )
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
    