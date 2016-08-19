var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Message = sequelize.define('messages', {
        
        message: DataTypes.STRING,
        userId: DataTypes.STRING,
        socketId: DataTypes.STRING,
        roomId: DataTypes.STRING,
        roomName: DataTypes.STRING
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    Message.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                retrieveById: function(user_id, onSuccess, onError) {
                    Message.find({where: {id: user_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                add: function(onSuccess, onError) {
                    
                    var message = this.message;
                    var userId = this.userId;
                    var socketId = this.socketId;
                    var roomId = this.roomId;
                    var roomName = this.roomName;
                
                    Message.build({ message: message, userId: userId, socketId: socketId, roomId: roomId, roomName: roomName })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(messageId, onSuccess, onError) {
                      
                    var id = messageId;
                                            
                     Message.update({ socketId: socketId, status: status }, {id: id} )
                            .success(onSuccess).error(onError);
                },
               
                removeById: function(user_id, onSuccess, onError) {
                    Message.destroy({id: user_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = Message;
    