module.exports = {
    
    createChannel: function(io, socket, data, Channel, User, utils) {
        
            var usersInChannel = [];
            var userModelsInChannel = [];
            
            usersInChannel.push(data.createdByUserId);
            userModelsInChannel.push(JSON.parse(data.createdByUserModel));

            var channel = Channel.build({
                                  name: data.name,
                                  createdByUserId: data.createdByUserId,
                                  usersInChannel: JSON.stringify(usersInChannel),
                                  messageCount: 0,
                                  userModelsInChannel: JSON.stringify(userModelsInChannel)
                                  });
            
            channel.add(function(success) {
                
            //var usersInChannel = [];         

            var user = User.build();
            
            user.retrieveById(data.createdByUserId, function(users) {
                
                    if (users) {
                        
                        var channelsForUserArray = [];
                        ////console.log('usersinchannel' + users.inChannels);
                        
                        if(typeof users.inChannels === 'undefined' || users.inChannels == null || users.inChannels == "null") {
                           
                            ////console.log('no inChannel');
                             channelsForUserArray.push(success.id.toString());
                            
                        } else {
                            
                            ////console.log('already inChannel');
                            
                            var parsedInChannels = JSON.parse(users.inChannels);
                            ////console.log(parsedInChannels);
                            for(i = 0; i < parsedInChannels.length; i++) {
                                channelsForUserArray.push(parsedInChannels[i].toString());
                            }
                            
                            channelsForUserArray.push(success.id.toString());
                            
                        }
                           
                        
                            console.log('****NEW channel name ' + data.name);
                            
                            var channelNamesForUserArray = [];
                            ////console.log('usersinchannel' + users.inChannels);
                            
                            if(typeof users.inChannelNames === 'undefined' || users.inChannelNames == null || users.inChannelNames == "null") {
                               
                                ////console.log('no inChannel');
                                 channelNamesForUserArray.push(data.name);
                                
                            } else {
                                
                                ////console.log('already inChannel');
                                
                                var parsedInChannelNames = JSON.parse(users.inChannelNames);
                                ////console.log(parsedInChannels);
                                for(i = 0; i < parsedInChannelNames.length; i++) {
                                    channelNamesForUserArray.push(parsedInChannelNames[i]);
                                }
                                
                                channelNamesForUserArray.push(data.name);
                                
                            }
                    
                            var uniqueChannelsForUserArray = Array.from(new Set(utils.flatten(channelsForUserArray)));
                            var uniqueChannelNamesForUserArray = Array.from(new Set(utils.flatten(channelNamesForUserArray)));
                                                    
                                            
                            user.status = "online";
                            user.socketId = socket.id;
                            user.inChannels = JSON.stringify(uniqueChannelsForUserArray);
                            user.inChannelNames = JSON.stringify(uniqueChannelNamesForUserArray);
                            user.currentChannel = success.id.toString();
                            
                            user.updateById(data.createdByUserId, function(success) {
                                
                                    if (success) {	
                                            console.log(success);
                                    } else {
                                      //res.send(401, "User not found");
                                    }
                              }, function(error) {
                                 console.log(error);
                                    //res.send("User not found");
                              });
                         
     
                    } else {
   
                    }
              }, function(error) {
                 
              });

     
                socket.join(success.id);
      
                socketChannelIdsArray = [];
                if (typeof socket.channelIds === "undefined") {
                    socketChannelIdsArray.push(success.id);
                } else {
                    socketChannelIdsArray.push(socket.channelIds);
                    socketChannelIdsArray.push(success.id);
                }
                
                socket.channelIds = Array.from(new Set(utils.flatten(socketChannelIdsArray)));
    
                socket.emit('channel-ready', {
                                   channelId: success.id,
                                   channelName: channel.name,
                                   usersInChannel: channel.usersInChannel,
                                   createdByUserId: data.createdByUserId
                                   });
  
                   
            var usersInChannel = [];
            
            },
            
            function(err) {
                
                ////console.log("New channel could NOT be created!");        
                var usersInChannel = [];
            
            });
            
            
    },
    
    
    enterChannel: function(io, socket, data, User, Channel, Message, userModule, messageModule, utils) {
        
        var channelIdArray = [];
        //var channelNameArray = [];
 
            var channelId = data.channelId;
            socket.join(channelId);
            channelIdArray.push(channelId);
  
            var channel = Channel.build();
            
            channel.retrieveById(channelId, function(channels) {
                
                if (channels) {
                    
                  usersInChannel = JSON.parse(channels.usersInChannel);
                  usersInChannel.push(data.userEnteringChannel.toString());
      
                  var uniqueUsersInChannel = Array.from(new Set(usersInChannel));

                    channel.usersInChannel = JSON.stringify(uniqueUsersInChannel);
                    channel.name = channels.name;
                    
                    channel.updateById(channelId, function(success) {
                            
                            if (success) {

                                 socketChannelIdsArray = [];
                                if (typeof socket.channelIds === "undefined") {
                                    socketChannelIdsArray.push(channelId);
                                } else {
                                    socketChannelIdsArray.push(socket.channelIds);
                                    socketChannelIdsArray.push(channelId);
                                }
                                
                                socket.channelIds = Array.from(new Set(utils.flatten(socketChannelIdsArray)));            
                                                                                         
                                socket.emit('entered-channel-details', {
                                        channel: JSON.stringify(channels),
                                        
                                });
                                 
                                 //channelNameArray.push(channels.name);
                                 
                                 var usersInChannel = JSON.parse(channels.usersInChannel);
               
                                    var user = User.build();
                
                                    user.retrieveById(data.userEnteringChannel, function(users) {
                
                                        if (users) {
                                            
                                            var channelsForUserArray = [];
                                            
                                            if(typeof users.inChannels === 'undefined' || users.inChannels == null || users.inChannels == "null") {
                                               
                                                 channelsForUserArray.push(channelId.toString());
                                                
                                            } else {
               
                                                var parsedInChannels = JSON.parse(users.inChannels);
                                             
                                                for(i = 0; i < parsedInChannels.length; i++) {
                                                    channelsForUserArray.push(parsedInChannels[i].toString());
                                                }
                                                
                                                channelsForUserArray.push(channelId.toString());
                                                
                                            }
                                            
                                                                    
                                                var channelNamesForUserArray = [];
                                                ////console.log('usersinchannel' + users.inChannels);
                                                
                                                if(typeof users.inChannelNames === 'undefined' || users.inChannelNames == null || users.inChannelNames == "null") {
                                                   
                                                    ////console.log('no inChannel');
                                                     channelNamesForUserArray.push(channels.name);
                                                    
                                                } else {
                                                    
                                                    ////console.log('already inChannel');
                                                    
                                                    var parsedInChannelNames = JSON.parse(users.inChannelNames);
                                                    ////console.log(parsedInChannels);
                                                    for(i = 0; i < parsedInChannelNames.length; i++) {
                                                        channelNamesForUserArray.push(parsedInChannelNames[i]);
                                                    }
                                                    
                                                    channelNamesForUserArray.push(channels.name);
                                                    
                                                }
                        
                                                    user.status = "online";
                                                    user.socketId = socket.id;
                                                    
                                                    var uniqueChannelsForUserArray = Array.from(new Set(utils.flatten(channelsForUserArray)));
                                                    var uniqueChannelNamesForUserArray = Array.from(new Set(utils.flatten(channelNamesForUserArray)));
                                                                     
                                                    user.inChannels = JSON.stringify(uniqueChannelsForUserArray);
                                                    user.inChannelNames = JSON.stringify(uniqueChannelNamesForUserArray);
                                                   
                                                    user.currentChannel = channelId.toString();
                                                    
                                                    user.updateById(data.userEnteringChannel, function(success) {
                                                        
                                                            if (success) {
                                                                
                                             
                                                            user.findAllWhere(usersInChannel, function(users) {
                                                                    
                                                                     if (users) {
                                                                     
                                                                     userModule.updateConnectedClientsInChannel(io, socket, Channel, User, utils, JSON.stringify(channelIdArray));
                                                                                                   
                                                                             /*//console.log('emitting channel clients: ' + channels.name+JSON.stringify(users));
                                                                             
                                                                             io.to(channels.name).emit('connected-clients-in-channel', {
                                                                                 usersInChannel: JSON.stringify(users),
                                                                                 channelName: channels.name
                                                                             });*/
                                                               
                                                                    } else {
                                                                      //res.send(401, "User not found");
                                                                    }
                                                                    
                                                              }, function(error) {
                                                                    //res.send("User not found");
                                                              });
                                 
                                            
                                                                 channel.retrieveAll(function(channelsTwo) {
                                                                                             
                                                                         if (channelsTwo) {
                                                                             
                                                                             var channelArray = [];
                                                                             var allChannelsArray = [];
                                                                             
                                                                                 for(i = 0; i < channelsTwo.length; i++) {
                                                                                                       
                                                                                 if (channelsTwo[i].createdByUserId == data.userEnteringChannel) {
                                                                                    channelArray.push(channelsTwo[i]);
                                                                                 }
                                                                                 
                                                                                 allChannelsArray.push(channelsTwo[i]);
                                                            
                                                                             }                                            
                                                                                              
                                                                             var uniqueChannelArray = Array.from(new Set(channelArray));
                                                                             var uniqueAllChannelsArray = Array.from(new Set(allChannelsArray));
                                                                             
                                                                                 //////console.log(channelArray);
                                                                                 //console.log('emitting user-channels: ' + JSON.stringify(uniqueChannelArray));
                                                                                 
                                                                                 socket.emit('user-channels', {
                                                                                   availableChannels: JSON.stringify(uniqueChannelArray)
                                                                                 });
                                                                                
                                                                                //socket.emit('available-channels', {availableChannels: JSON.stringify(uniqueAllChannelsArray) });
                                                                                
                                                                                 var channelArray = [];
                                                                                 var allChannelsArray = [];
                                                                                 
                                                                                 
                                                                           //io.sockets.emit('available-channels', {availableChannels: JSON.stringify(channels) });      
                                                                         
                                                                         } else {
                                                                           //res.send(401, "User not found");
                                                                         }
                                                                         
                                                                   }, function(error) {
                                                                         //res.send("User not found");
                                                                   });
                             
                                                    
                                                            messageModule.getMessageHistory(io, socket, Message, channelId);
                                            
                                       
                                                    } else {
                                                      //res.send(401, "User not found");
                                                    }
                                                    
                                                    
                                              }, function(error) {
                                                    //res.send("User not found");
                                              });
                                                                       
    
                                       } else {
                                         //res.send(401, "User not found");
                                       }
                                       
                                 }, function(error) {
                                       //res.send("User not found");
                                 });
    
    
                            } else {
                              //res.send(401, "User not found");
                            }
                            
                      }, function(error) {
                            //res.send("User not found");
                      });
                    
                     
                   } else {
   
                    }
                    
              }, function(error) {
                 
              });
            
        
    }
    
    
            
        
        /*socket.on('decline-channel-invitation', function (data) {
            
            var channel = Channel.build();
            
            channel.removeById(data.joiningChannelId, function(channels) {
                
                    if (channels) {
                        
                        var user = User.build();
                               
                        user.retrieveById(data.invitedByUserId, function(users) {
                            
                                if (users) {				
            
                                    io.to(users.socketId).emit('channel-invitation-declined', {declinedByUsername: data.joinerUsername});
                                   
                                    socket.emit('close-channel-create-modal');
                                    
                                } else {
            
                                }
                                
                          }, function(error) {
                         
                          });
                        
                             
                    } else {
                    
                    }
              }, function(error) {
                   
              });   
        });*/
        
        
        
    
}