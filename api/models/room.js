var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Room = sequelize.define('rooms', {
        
        name: DataTypes.STRING,
        createdByUserId: DataTypes.STRING,
        usersInRoom: DataTypes.STRING
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
                    var createdByUserId = this.createdByUserId;
                    var usersInRoom = this.usersInRoom;
                    
                    Room.build({ name: name,
                               createdByUserId: createdByUserId,
                               usersInRoom: usersInRoom
                               })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(user_id, onSuccess, onError) {
                      
                    var id = user_id;
                    var name = this.name;
                    var usersInRoom = this.usersInRoom;

                     Room.update({ name: name, usersInRoom: usersInRoom}, {id: id} )
                            .success(onSuccess).error(onError);
                },
               
                removeById: function(user_id, onSuccess, onError) {
                    Room.destroy({id: user_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = Room;
    