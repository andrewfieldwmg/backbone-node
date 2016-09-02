var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Stream = sequelize.define('streams', {
        
        filename: DataTypes.STRING,
        streamedByUserId: DataTypes.STRING,
        streamedByUsername: DataTypes.STRING,
        roomId: DataTypes.STRING,
        roomName: DataTypes.STRING
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    Stream.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(stream_id, onSuccess, onError) {
                    Stream.findAll({where: {id: stream_id }})
                       .success(onSuccess).error(onError);
                },
              
                retrieveById: function(stream_id, onSuccess, onError) {
                    Stream.find({where: {id: stream_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                add: function(onSuccess, onError) {
                    
                    var filename = this.filename;
                    var streamedByUserId = this.streamedByUserId;
                    var streamedByUsername = this.streamedByUsername;
                    var roomId = this.roomId;
                    var roomName = this.roomName;
                    
                    Stream.build({
                               filename: filename,
                               streamedByUserId: streamedByUserId,
                               streamedByUsername: streamedByUsername,
                               roomId: roomId,
                               roomName: roomName
                               })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(stream_id, onSuccess, onError) {
                    
                    var filename = this.filename;
                    var streamedByUserId = this.streamedByUserId;
                    var streamedByUsername = this.streamedByUsername;
                    var roomId = this.roomId;
                    var roomName = this.roomName;
                    
                    Stream.update({
                                filename: filename,
                                streamedByUserId: streamedByUserId,
                                streamedByUsername: streamedByUsername,
                                roomId: roomId,
                                roomName: roomName              
                                },
                                {id: stream_id} )
                            .success(onSuccess).error(onError);
                },
                
                removeById: function(stream_id, onSuccess, onError) {
                    Stream.destroy({id: stream_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = Stream;
    