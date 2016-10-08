module.exports = {
    
    refreshConnection: function(io, socket, data, User, Channel, Stream, userModule, streamModule, mailModule, utils) {
        
            var username = data.username;
            var userId = data.userId;
            var channelIds = data.channelIds;
            var channelName = data.channelName;
            var userColour = data.userColour;
            
            if(userId !== "null" && username !== "null") {
                        
                    var mailOptions = {
                        from: '"listentome.io" <no-reply@listentome.io>', // sender address
                        to: 'andyfield83@gmail.com', // list of receivers
                        subject: username + ' has just connected!', // Subject line
                        text: username + ' has just connected!', // plaintext body
                        html: '<b>' + username + ' has just connected!</b>' // html body
                    };
                    
                    //mailModule.sendMail(config, mailOptions);
                    
                    if(typeof channelIds !== 'undefined' && channelIds !== null && channelIds !== "null") {
        
                        socketChannelIdsArray = [];    
                        var joinedChannelIdsArray = JSON.parse(channelIds);
                       
                        for(i = 0; i < joinedChannelIdsArray.length; i++) {
                            //socket.join(joinedChannelIdsArray[i]);
                            socketChannelIdsArray.push(joinedChannelIdsArray[i]);
                        }
                        
                        socket.channelIds = Array.from(new Set(utils.flatten(socketChannelIdsArray)));
                    
                    } else {
                         ////console.log('channelids is null');
                    }
    
      
                        socket.userId = userId;
                            
                        //connectedUsernames.push(username);
                        //connectedUserIds.push(userId);
                        
                        var user = User.build();	
                          
                        user.socketId = socket.id;
                        user.status = "online";
                        user.inChannels = channelIds;
                        //user.username = username;
                    
                        user.updateById(userId, function(success) {
                  
                            if (success) {
                                
                                user.retrieveById(userId, function(userModel) {
                    
                                        if (userModel) {
                                             
                                             socket.emit('socket-info', {
                                                 socketId: socket.id,
                                                 userId: userId,
                                                 userColour: userColour
                                                 });
                                             
                                            socket.emit('socket-model', {
                                                 userModel: JSON.stringify(userModel)
                                            });
                                            
                                             userModule.updateUserContactsView(io, socket, Channel, User, utils, userId);          
                         
                                             io.sockets.emit("user-status-updated", {userId: userId, userStatus: "Online"});
                
                
                                        } else {
                       
                                        }
                                  }, function(error) {
                                     
                                });
    
                                
                                //var uniqueUsernameArray = Array.from(new Set(connectedUsernames));
                                
                                    user.retrieveAll(function(users) {
                    
                                    if (users) {
                            
                                        io.sockets.emit('connected-clients', {connectedUsers: JSON.stringify(users)});
                                                                    
                                       ////console.log(channelIds);
                                       
                                       if(typeof channelIds !== "undefined" && channelIds !== null && channelIds !== "null"
                                          && typeof channelName !== "undefined" && channelName !== null && channelName !== "null") {
                                        
                                        //console.log('channel ids:' + channelIds);
                                            
                                            userModule.updateConnectedClientsInChannel(io, socket, Channel, User, utils, channelIds, channelName);                                                                                                                             
                                       }
         
                          
                                } else {
                                  //res.send(401, "User not found");
                                }
                                    
                          }, function(error) {
                            //res.send("User not found");
                         });
                
                                    
                        
                        if(typeof channelName !== "undefined" && channelName !== "null" && channelName !== null) {
                                            
                                        var channel = Channel.build();
                                        
                                        channel.retrieveAll(function(channels) {
                                            
                                             if (channels) {
                                                
                                                var channelArray = [];
                                                var allChannelsArray = [];
                                                
                                                for(i = 0; i < channels.length; i++) {
                                                    
                                                    if (channels[i].createdByUserId == userId) {
                                                       channelArray.push(channels[i]);
                                                    }
                                                        allChannelsArray.push(channels[i]);
                                                }
                                                         
                                                    var uniqueChannelArray = Array.from(new Set(channelArray));
                                                    var uniqueAllChannelArray = Array.from(new Set(allChannelsArray));
                                                    
                                                    var parsedChannelNames = JSON.parse(channelName);
                                                    
                                                    for(i = 0; i < parsedChannelNames.length; i++) {
                                                        
                                                        ////console.log('will send to: ' + parsedChannelNames[i]);
                                                        ////console.log('will send channels: ' + JSON.stringify(uniqueChannelArray));
                                                        
                                                        socket.emit('user-channels', {availableChannels: JSON.stringify(uniqueChannelArray) });
                                                       
                                                    }
                                                    
                                                     socket.emit('available-channels', {availableChannels: JSON.stringify(uniqueAllChannelArray) });
                                                     
                                                var channelArray = [];
        
                                             } else {
                                               ////console.log("No channels found!");
                                             }
                                             
                                       }, function(error) {
                                            
                                       });
                                        
                            } else {
                                
                                socket.emit('user-channels', {availableChannels: null });
                                
                            }
                            
                                        
                        } else {
                            
                                ////console.log("User not found");
                                
                        }
                        
                  }, function(error) {
                    
                  });
                        
                        
                        
                    streamModule.updateStreamsForUser(io, socket, Stream);
                }
        

            },
            
            
            disconnect: function(io, socket, proc, User, Stream, Channel) {

                proc.kill('SIGINT');

                    var user = User.build();	
          
                    user.socketId = socket.id;
                    user.status = "offline";
                    //user.username = username;
                                 
                    user.updateById(socket.userId, function(success) {
              
                        if (success) {
                            
                                //socket.emit('socket-info', { socketIndex: socketIndex, socketId: socket.id, userId: userId });
                                //var uniqueUsernameArray = Array.from(new Set(connectedUsernames));
                                //////console.log('emit connected clients');
                                
                                    io.sockets.emit("user-status-updated", {userId: socket.userId, userStatus: "Offline"});
                
                
                                    user.retrieveAll(function(users) {
                    
                                    if (users) {
                                     ////console.log('emitting clients on disconnect: ' + JSON.stringify(users));
                                        io.sockets.emit('connected-clients', {
                                   
                                            connectedUsers: JSON.stringify(users)
                                        });
                                                                    
                                       ////console.log(socket.channelIds);
                                       if(typeof socket.channelIds !== "undefined" && typeof socket.channelNames !== "undefined") {
                                        
                                            updateConnectedClientsInChannel(JSON.stringify(socket.channelIds), JSON.stringify(socket.channelNames));
                                       }
                                       
                                                                                        
                                            var stream = Stream.build();	
                                        
                                                  stream.state = "offline";
                                                  
                                                  stream.updateStateByStreamerId(socket.userId, function(success) {
                                            
                                                      if (success) {
                            
                                                             var channel = Channel.build(); 
                                           
                                                             channel.currentStreamStatus = "stopped";
                                                              
                                                             channel.updateStreamStatusByStreamerId(socket.userId, function(success) {
                                                                 
                                                                     if (success) {	
                                                                             
                                                                     } else {
                                                                      
                                                                     }
                                                               }, function(error) {
                                                                     
                                                             });
                                                             
                                                             
                                                                stream.retrieveAll(function(streams) {
                                                    
                                                                    if (streams) {
                                                                               
                                                                           //socket.emit('emptyMessages');                               
                                                                               
                                                                               //console.log('emitting mess ' + messages[i].message);
                                                                               
                                                                               io.sockets.emit('available-streams', {
                                                                                   availableStreams: JSON.stringify(streams)
                                                                               });
                                                                                                                              
                                                                           
                                                                    } else {
                                                                      //res.send(401, "User not found");
                                                                    }
                                                                    
                                                              }, function(error) {
                                                                    //res.send("User not found");
                                                              });
                                                                                            
                                                      } else {
                                                          
                                                              ////console.log("User not found");
                                                              
                                                      }
                                                      
                                                }, function(error) {
                                                  
                                                });
                        
                        
                                } else {
                                  //res.send(401, "User not found");
                                }
                                                
                                                
                            }, function(error) {
                              //res.send("User not found");
                           });
                                   
                                        
                        } else {
                            
                                ////console.log("User not found");
                                
                        }
                        
                  }, function(error) {
                    
                  });
                        
                
           

            }
        
    
}
    
    
