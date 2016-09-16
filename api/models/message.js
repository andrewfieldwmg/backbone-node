var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Message = sequelize.define('messages', {
        
        message: DataTypes.STRING,
        userId: DataTypes.STRING,
        username: DataTypes.STRING,
        userColour: DataTypes.STRING,
        socketId: DataTypes.STRING,
        channelId: DataTypes.STRING,
        channelName: DataTypes.STRING
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    Message.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(channel_id, limit, onSuccess, onError) {
                    //var limit = this.limit;
                    if (!limit) {
                        limit = 95,18446744073709551615;
                    }
                    
                    Message.findAll({where: {channelId: channel_id }, limit: limit, order:[['id', 'ASC']]})
                       .success(onSuccess).error(onError);
                },
                
                retrieveById: function(user_id, onSuccess, onError) {
                    Message.find({where: {id: user_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                add: function(onSuccess, onError) {
                    
                    var message = this.message;
                    var userId = this.userId;
                    var username = this.username;
                    var userColour = this.userColour;
                    var socketId = this.socketId;
                    var channelId = this.channelId;
                    var channelName = this.channelName;
                
                    Message.build({
                        message: message,
                        username: username,
                        userId: userId,
                        userColour: userColour,
                        socketId: socketId,
                        channelId: channelId,
                        channelName: channelName
                        })
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
    