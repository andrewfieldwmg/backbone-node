var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Channel = sequelize.define('channels', {
        
        name: DataTypes.STRING,
        channelGenre: DataTypes.STRING,
        createdByUserId: DataTypes.STRING,
        usersInChannel: DataTypes.STRING,
        messageCount: DataTypes.INTEGER,
        userModelsInChannel: DataTypes.TEXT,
        currentStreamId: DataTypes.INTEGER,
        currentStreamName: DataTypes.STRING,
        currentStreamStatus: DataTypes.STRING,
        currentStreamTime: DataTypes.STRING,
        currentStreamerId: DataTypes.INTEGER,
        currentStreamerName: DataTypes.STRING

      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    Channel.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                retrieveById: function(channel_id, onSuccess, onError) {
                    Channel.find({where: {id: channel_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(channel_id, onSuccess, onError) {
                    Channel.findAll({where: {id: channel_id }})
                       .success(onSuccess).error(onError);
                },
              
                add: function(onSuccess, onError) {
                    
                    var name = this.name;
                    var channelGenre = this.channelGenre;
                    var createdByUserId = this.createdByUserId;
                    var usersInChannel = this.usersInChannel;
                    var messageCount = this.messageCount;
                    var userModelsInChannel = this.userModelsInChannel;
                    
                    Channel.build({
                                name: name,
                                channelGenre: channelGenre,
                                createdByUserId: createdByUserId,
                                usersInChannel: usersInChannel,
                                messageCount: messageCount,
                                userModelsInChannel: userModelsInChannel
                               })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(channel_id, onSuccess, onError) {
                      
                    var id = channel_id;
                    var name = this.name;
                    var channelGenre = this.channelGenre;
                    var usersInChannel = this.usersInChannel;
                    var userModelsInChannel = this.userModelsInChannel;

                     Channel.update({
                        name: name,
                        channelGenre: channelGenre,
                        usersInChannel: usersInChannel,
                        userModelsInChannel: userModelsInChannel
                        }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                       
                updateStreamById: function(channel_id, onSuccess, onError) {
                      
                    var id = channel_id;
                    var currentStreamId = this.currentStreamId;
                    var currentStreamName = this.currentStreamName;
                    var currentStreamStatus = this.currentStreamStatus;
                    var currentStreamerId = this.currentStreamerId;
                    var currentStreamerName = this.currentStreamerName;

                     Channel.update({
                        currentStreamId: currentStreamId,
                        currentStreamName: currentStreamName,
                        currentStreamStatus: currentStreamStatus,
                        currentStreamerId: currentStreamerId,
                        currentStreamerName: currentStreamerName
                        }, {id: id} )
                            .success(onSuccess).error(onError);
                },
                                 
                updateStreamStatusByStreamId: function(stream_id, onSuccess, onError) {
                      
                    var currentStreamStatus = this.currentStreamStatus;

                     Channel.update({
                        currentStreamStatus: currentStreamStatus
                        }, {currentStreamId: stream_id} )
                            .success(onSuccess).error(onError);
                },
                                   
                updateStreamTimeById: function(channel_id, onSuccess, onError) {
                      
                    var currentStreamTime = this.currentStreamTime;

                     Channel.update({
                        currentStreamTime: currentStreamTime
                        }, {id: channel_id} )
                            .success(onSuccess).error(onError);
                },
                
                updateStreamStatusByStreamerId: function(streamer_id, onSuccess, onError) {
                      
                    var currentStreamStatus = this.currentStreamStatus;

                     Channel.update({
                        currentStreamStatus: currentStreamStatus
                        }, {createdByUserId: streamer_id} )
                            .success(onSuccess).error(onError);
                },
                 
                incrementMessageCount: function(channel_id) {
                      
                        sequelize.query("UPDATE channels SET messageCount = messageCount + 1 WHERE id = " + channel_id).spread(function(results, metadata) {
                        
                        });
                },
               
                removeById: function(user_id, onSuccess, onError) {
                    Channel.destroy({id: user_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = Channel;
    