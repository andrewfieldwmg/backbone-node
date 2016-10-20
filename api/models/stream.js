var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var Stream = sequelize.define('streams', {
        
        filename: DataTypes.STRING,
        streamedByUserId: DataTypes.STRING,
        streamedByUsername: DataTypes.STRING,
        channelId: DataTypes.STRING,
        channelName: DataTypes.STRING,
        state: DataTypes.STRING,
        streamTime: DataTypes.STRING,
        genre: DataTypes.STRING,
        upvotes: DataTypes.INTEGER
      }, {
        
        timestamps: true,
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    Stream.findAll({order: [['id', 'DESC']]}, {raw: true})
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
                    var channelId = this.channelId;
                    var channelName = this.channelName;
                    var state = this.state;
                    var streamTime = this.streamTime;
                    var genre = this.genre;
                    var upvotes = this.upvotes;
                    
                    Stream.build({
                               filename: filename,
                               streamedByUserId: streamedByUserId,
                               streamedByUsername: streamedByUsername,
                               channelId: channelId,
                               channelName: channelName,
                               state: state,
                               streamTime: streamTime,
                               genre: genre,
                               upvotes: upvotes
                               })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(stream_id, onSuccess, onError) {
                    
                    var filename = this.filename;
                    var streamedByUserId = this.streamedByUserId;
                    var streamedByUsername = this.streamedByUsername;
                    var channelId = this.channelId;
                    var channelName = this.channelName;
                    var state = this.state;
                    var streamTime = this.streamTime;
                    var genre = this.genre;
                    var upvotes = this.upvotes;
                    
                    Stream.update({
                                filename: filename,
                                streamedByUserId: streamedByUserId,
                                streamedByUsername: streamedByUsername,
                                channelId: channelId,
                                channelName: channelName,
                                state: state,
                                streamTime: streamTime,
                                genre: genre,
                                upvotes: upvotes
                                },
                                {id: stream_id} )
                            .success(onSuccess).error(onError);
                },
                
                updateStateById: function(stream_id, onSuccess, onError) {
                    
                    var state = this.state;
                    
                    Stream.update({
                                state: state
                                },
                                {id: stream_id} )
                            .success(onSuccess).error(onError);
                },
                
                updateStateByStreamerId: function(streamerId, onSuccess, onError) {
                    
                    var state = this.state;
                    
                    Stream.update({
                                state: state
                                },
                                {streamedByUserId: streamerId} )
                            .success(onSuccess).error(onError);
                },
                
                incrementUpvoteCount: function(stream_id) {
                      
                        sequelize.query("UPDATE streams SET upvotes = upvotes + 1 WHERE id = " + stream_id).spread(function(results, metadata) {
                        
                        });
                },
                
                getChannelIdByDisconnectedUser: function(user_id, onSuccess, onError) {
                      
                        Stream.find({where: {streamedByUserId: user_id, state: "live"}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                
                removeById: function(stream_id, onSuccess, onError) {
                    Stream.destroy({id: stream_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = Stream;
    