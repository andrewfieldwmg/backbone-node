var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var PrivateMessage = sequelize.define('privateMessages', {
        
        messageContent: DataTypes.STRING,
        messageType: DataTypes.STRING,
        senderUserId: DataTypes.INTEGER,
        senderUsername: DataTypes.STRING,
        recipientUserId: DataTypes.INTEGER,
        recipientUsername: DataTypes.STRING,
        status: DataTypes.STRING
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    PrivateMessage.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(private_message_id, limit, onSuccess, onError) {
                    //var limit = this.limit;
                    if (!limit) {
                        limit = 95,18446744073709551615;
                    }
                    
                    PrivateMessage.findAll({where: {id: private_message_id }, limit: limit, order:[['id', 'ASC']]})
                       .success(onSuccess).error(onError);
                },
                
                findAllWhereRecipientId: function(recipientUserId, limit, onSuccess, onError) {
                    //var limit = this.limit;
                    if (!limit) {
                        limit = 95,18446744073709551615;
                    }
                    
                    PrivateMessage.findAll({where: {recipientUserId: recipientUserId }, limit: limit, order:[['id', 'ASC']]})
                       .success(onSuccess).error(onError);
                },
                
                countUserMessages: function(recipientUserId, onSuccess, onError) {
                    
                    PrivateMessage.findAll({where: {recipientUserId: recipientUserId, status: "unread" }})
                       .success(onSuccess).error(onError);
                },
                
                
                retrieveById: function(private_message_id, onSuccess, onError) {
                    PrivateMessage.find({where: {id: private_message_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                add: function(onSuccess, onError) {
                    
                    var messageContent = this.messageContent;
                    var messageType = this.messageType;
                    var senderUserId = this.senderUserId;
                    var senderUsername = this.senderUsername;
                    var recipientUserId = this.recipientUserId;
                    var recipientUsername = this.recipientUsername;
                    var status = this.status;
                    
                    PrivateMessage.build({
                            messageContent: messageContent,
                            messageType: messageType,
                            senderUserId: senderUserId,
                            senderUsername: senderUsername,
                            recipientUserId: recipientUserId,
                            recipientUsername: recipientUsername,
                            status: status
                        })
                        .save().success(onSuccess).error(onError);
                },
               
                updateStatusById: function(private_message_id, onSuccess, onError) {
                      
                    var status = this.status;
                    
                     PrivateMessage.update({
                        status: status
                        }, {id: private_message_id} )
                            .success(onSuccess).error(onError);
                },
               
                removeById: function(private_message_id, onSuccess, onError) {
                    PrivateMessage.destroy({id: private_message_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = PrivateMessage;
    