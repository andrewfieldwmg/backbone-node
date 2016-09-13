var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Room = sequelize.define('rooms', {
        
        name: DataTypes.STRING,
        roomGenre: DataTypes.STRING,
        createdByUserId: DataTypes.STRING,
        usersInRoom: DataTypes.STRING,
        messageCount: DataTypes.INTEGER,
        userModelsInRoom: DataTypes.TEXT
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    Room.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                retrieveById: function(user_id, onSuccess, onError) {
                    Room.find({where: {id: user_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(room_id, onSuccess, onError) {
                    Room.findAll({where: {id: room_id }})
                       .success(onSuccess).error(onError);
                },
              
                add: function(onSuccess, onError) {
                    
                    var name = this.name;
                    var roomGenre = this.roomGenre;
                    var createdByUserId = this.createdByUserId;
                    var usersInRoom = this.usersInRoom;
                    var messageCount = this.messageCount;
                    var userModelsInRoom = this.userModelsInRoom;
                    
                    Room.build({
                                name: name,
                                roomGenre: roomGenre,
                                createdByUserId: createdByUserId,
                                usersInRoom: usersInRoom,
                                messageCount: messageCount,
                                userModelsInRoom: userModelsInRoom
                               })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var name = this.name;
                    var roomGenre = this.roomGenre;
                    var usersInRoom = this.usersInRoom;
                    var userModelsInRoom = this.userModelsInRoom;

                     Room.update({
                        name: name,
                        roomGenre: roomGenre,
                        usersInRoom: usersInRoom,
                        userModelsInRoom: userModelsInRoom
                        }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                
                incrementMessageCount: function(room_id) {
                      
                        sequelize.query("UPDATE rooms SET messageCount = messageCount + 1 WHERE id = " + room_id).spread(function(results, metadata) {
                        
                        });
                },
               
                removeById: function(user_id, onSuccess, onError) {
                    Room.destroy({id: user_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = Room;
    