module.exports = {
    
    refreshConnection: function(io, socket, data, User, Channel, Stream, userModule, streamModule, mailModule, utils) {
        
        var userId = data.userId;
        //var username = data.username;
        //var channelIds = data.channelIds;
        //var channelName = data.channelName;
        //var userColour = data.userColour;
        
         if(typeof userId !== "undefined" && userId !== "null" && userId !== null) {
                   
            var user = User.build();
            
             user.retrieveById(userId, function(userModel) {
        
                if (userModel) {
                          
                    console.log(userModel.inChannels);
                          
                    var mailOptions = {
                        from: '"listentome.io" <no-reply@listentome.io>', // sender address
                        to: 'andyfield83@gmail.com', // list of receivers
                        subject: userModel.username + ' has just connected!', // Subject line
                        text: userModel.username + ' has just connected!', // plaintext body
                        html: '<b>' + userModel.username + ' has just connected!</b>' // html body
                    };
                    
                    //mailModule.sendMail(config, mailOptions);
                    
                    if(typeof userModel.inChannels !== 'undefined' && userModel.inChannels !== null && userModel.inChannels !== "null") {
        
                        socketChannelIdsArray = [];    
                        var joinedChannelIdsArray = JSON.parse(userModel.inChannels);
                       
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
                          
                        user.socketId = socket.id;
                        user.status = "online";
                        user.inChannels = userModel.inChannels;
                        user.username = userModel.inChannels;
                    
                        user.updateById(userId, function(success) {
                  
                            if (success) {
                                
                                socket.emit('socket-info', {
                                            socketId: socket.id,
                                            userId: userId,
                                            username: userModel.username,
                                            userEmail: userModel.email,
                                            userGenre: userModel.userGenre,
                                            userColour: userModel.userColour,
                                            userLocation: userModel.userLocation,
                                            inChannels: userModel.inChannels
                                });
                            
   
                            /*socket.emit('socket-model', {
                                 userModel: JSON.stringify(userModel)
                            });*/
                            
                             userModule.updateUserContactsView(io, socket, Channel, User, utils, userId);          
         
                             io.sockets.emit("user-status-updated", {userId: userId, userStatus: "Online"});

                             
                                  //var uniqueUsernameArray = Array.from(new Set(connectedUsernames));
                                
                                    user.retrieveAll(function(users) {
                    
                                    if (users) {
                            
                                        io.sockets.emit('connected-clients', {connectedUsers: JSON.stringify(users)});
                                                                    
                                       ////console.log(channelIds);
                                       
                                       if(typeof userModel.inChannels !== "undefined" && userModel.inChannels !== null && userModel.inChannels !== "null") {
                                        
                                        //console.log('channel ids:' + channelIds);
                                            
                                            userModule.updateConnectedClientsInChannel(io, socket, Channel, User, utils, userModel.inChannels);                                                                                                                             
                                       }
         
                          
                                } else {
                                  //res.send(401, "User not found");
                                }
                                    
                          }, function(error) {
                            //res.send("User not found");
                         });
                
                                    
                        
                        if(typeof userModel.inChannels !== "undefined" && userModel.inChannels !== "null" && userModel.inChannels !== null) {
                                            
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
                                                    
                                                    //var parsedChannelNames = JSON.parse(channelName);
                                                    
                                                    //for(i = 0; i < parsedChannelNames.length; i++) {
                                               
                                                        socket.emit('user-channels', {availableChannels: JSON.stringify(uniqueChannelArray) });
                                                       
                                                    //}
                                                    
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
                                  
                    
                            } else {
           
                            }
                            
                            
                      }, function(error) {
                         
                    });
                             
                      
                         
                }
        

            },
            
            
            disconnect: function(io, socket, proc, userModule, User, Stream, Channel, utils) {

                proc.kill('SIGINT');

                    var user = User.build();	
 
                    user.status = "offline";
                     
                    user.updateBySocketId(socket.id, function(success) {
              
                        if (success) {
                            console.log('user updated on disconnect');
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
                                       if(typeof socket.channelIds !== "undefined") {
                                        
                                            //userModule.updateConnectedClientsInChannel(JSON.stringify(socket.channelIds));
                                            userModule.updateConnectedClientsInChannel(io, socket, Channel, User, utils, JSON.stringify(socket.channelIds));                                                                                                                             
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