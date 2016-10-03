module.exports = {
        
        processNewUsername: function(io, socket, data, User, utils) {
                       
                //if (userColour == "null" || userColour == "undefined") {
                    var userColour = utils.colors[Math.floor(Math.random()*utils.colors.length)];           
                //}
                
                var user = User.build({
                                      username: data.username,
                                      socketId: socket.id,
                                      status: "online",
                                      userColour: userColour
                                      });
                
                user.add(function(success) {
                    
                    socket.emit('socket-info', {
                        //socketIndex: socketIndex,
                        socketId: socket.id,
                        userId: success.id,
                        userColour: userColour
                        });
                    
                    //connectedUsernames.push(data.username);
                    //connectedUserIds.push(success.id);
                    
                    socket.userId = success.id;
           
                    //var uniqueUsernameArray = Array.from(new Set(connectedUsernames));
         
                },
                
                function(err) {
                    
                    ////console.log("New socket user could NOT be created!");
                    
                });
                  
        
    },
    
    processNewUserGenre: function(io, socket, data, User) {
                                   
                var user = User.build();	
                  
                user.userGenre = data.userGenre;
                user.socketId = data.socketId;
                user.status = "online";
                user.password = "";
                
                user.updateByIdFull(data.userId, function(success) {
                    
                        if (success) {	
                                
                        } else {
                         
                        }
                  }, function(error) {
                        
                  });
                  
        
    },
    
    processNewUserLocation: function(io, socket, data, User) {
                                   
                var user = User.build();	
                  
                user.userGenre = data.userGenre;
                user.socketId = data.socketId;
                user.status = "online";
                user.userLocation = data.userLocation;
                user.password = "";
                 
                user.updateByIdFull(data.userId, function(success) {
                    
                        if (success) {	
                                
                        } else {
                         
                        }
                  }, function(error) {
                        
                  });
        
    },
    
    processNewUserProfileImage: function(io, socket, data, config, fs, fileStream, im) {
                                   
            var imageExtension = data.name.split('.').pop();
            var imageFileName = data.userId + '.' + imageExtension;
            var hqFilePath = config.filePaths.userProfileImageDir + "/" + imageFileName;
                
             fileUploadWriteStream = fs.createWriteStream(hqFilePath);
             
             fileStream.pipe(fileUploadWriteStream);
                               
                fileStream.on('end', function() {
                    
                    console.log('profile image saved!');              
             
                      var thumbnailFilename = data.userId + "_profile.jpg";
                        
                        im.resize({
                            srcData: fs.readFileSync(hqFilePath, 'binary'),
                            width:   60
                            
                          }, function(err, stdout, stderr){
                            
                            if (err) throw err
                            fs.writeFileSync(config.filePaths.userProfileImageDir + "/" + thumbnailFilename, stdout, 'binary');
                  
                        });
                    
                });
    
    
    },
    
    processNewUserProfileEmail: function(io, socket, data, User) {
    
                var user = User.build();	
                  
                user.userGenre = data.userGenre;
                user.socketId = data.socketId;
                user.status = "online";
                user.userLocation = data.userLocation;
                user.email = data.userEmail;
                user.password = "";
                 
                user.updateByIdFull(data.userId, function(success) {
                    
                        if (success) {	
                                
                        } else {
                         
                        }
                  }, function(error) {
                        
                  });
                
    
    },
    
    processNewUserProfilePassword: function(io, socket, data, User) {
    
                var user = User.build();	
                  
                user.userGenre = data.userGenre;
                user.socketId = data.socketId;
                user.status = "online";
                user.userLocation = data.userLocation;
                user.email = data.userEmail;
                user.password = data.userPassword;
                
                user.updateByIdFull(data.userId, function(success) {
                    
                        if (success) {	
                                
                            user.retrieveById(data.userId, function(userModel) {
                    
                                        if (userModel) {
                                             
                                            socket.emit('socket-model', {
                                                 userModel: JSON.stringify(userModel)
                                            });
                         
                                        } else {
                       
                                        }
                                                                                                       
                                             user.retrieveAll(function(users) {
                                                 
                                                     if (users) {
                                                     
                                                         io.sockets.emit('connected-clients', {
                                                            connectedUsers: JSON.stringify(users)
                                                         });
                                                         
                                                     } else {
                                                       //res.send(401, "User not found");
                                                     }
                                               }, function(error) {
                                                     //res.send("User not found");
                                               });
                                                                                
                    
                                  }, function(error) {
                                     
                                });
                                                      
                        } else {
                         
                        }
                  }, function(error) {
                        
                  });
    
    },
    
    checkUserStatus: function(io, socket, data, User) {
                
                var user = User.build();
                user.retrieveById(data.userIdToCheck, function(userModel) {
               
                       if (userModel) {
                                        
                            socket.emit('check-user-status-success', {userStatusResult: userModel.status});
                                
                       } else {
        
                       }
                 }, function(error) {
                    
                });
                
    },
    
    getUser: function(io, socket, data, User) {
                
                var user = User.build();
                user.retrieveById(data.userId, function(userModel) {
               
                       if (userModel) {
                                        
                            socket.emit('get-user-success', {userModel: JSON.stringify(userModel)});
                                
                       } else {
        
                       }
                 }, function(error) {
                    
                });
        
    },
    
    updateConnectedClientsInChannel: function(io, socket, Channel, User, utils, channelIds, channelName) {
                      
                    console.log('update connected clients function');
                                
                    var channel = Channel.build();
                    
                    channel.findAllWhere(JSON.parse(channelIds), function(channels) {
                       
                        if (channels) {
    
                            usersInChannelArray = [];     
                            for(i = 0; i < channels.length; i++) {
                               usersInChannelArray.push(JSON.parse(channels[i].usersInChannel)); 
                            }
                            
                            var uniqueFlatUsersInChannelArray = Array.from(new Set(utils.flatten(usersInChannelArray)));
                            ////console.log(uniqueFlatUsersInChannelArray);
                            
                           var user = User.build();
    
                            user.findAllWhere(uniqueFlatUsersInChannelArray, function(users) {
                                
                                if (users) {
                                
                                  var channelNameArray = JSON.parse(channelName);
                                    var channelIdsArray = JSON.parse(channelIds);
                                    
                                            for(i = 0; i < channelIdsArray.length; i++) {
                                            
                                        ////console.log(channelIdsArray[i]);
                                        //console.log('emitting clients IN CHANNEL to: ' + channelIdsArray[i] + '-' + JSON.stringify(users));
                                                 
                                                 io.to(channelIdsArray[i]).emit('connected-clients-in-channel', {
                                                              usersInChannel: JSON.stringify(users),
                                                              channelId: channelIdsArray[i]
                                                 });
                                            }
                                
                                        channelNameArray = [];
                                        users = [];
                                        
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
                    
                                        
    },
    
    updateUserContactsView: function(io, socket, Channel, User, utils, userId) {
            
                var user = User.build();
                
                user.retrieveById(userId, function(userModel) {
               
                       if (userModel) {
                                                                     
                            var userSocketId = userModel.socketId;
                                               
                            if(userModel.userContacts !== "" && userModel.userContacts !== "null" && userModel.userContacts !== null) {
                                                 
                               var userContactModelArray = [];
                               
                               var userContacts = JSON.parse(userModel.userContacts);
                                     
                               for(i = 0; i < userContacts.length; i++) {
                                
                                        var user = User.build();
                                            
                                        user.retrieveById(userContacts[i], function(userModel) {
                                       
                                               if (userModel) {
                                                                
                                                   userContactModelArray.push(userModel);
                                                   
                                                   callback(userContactModelArray);
                                                 
                                                        
                                               } else {
                                
                                               }
                                         }, function(error) {
                                            
                                        });
            
                                
                                }
                               
                                    function callback(userContactModelArray) {
                                      io.to(userSocketId).emit("user-contacts-updated", {userContacts: JSON.stringify(userContactModelArray) });
                                    }
                                        
                               
                            } else {
                                
                                io.to(userSocketId).emit("user-contacts-updated", {userContacts: null });
                                
                            }
                            
                                
                                 
                       } else {
        
                       }
                       
                       
                 }, function(error) {
                    
                });
                
                    
    }
    

}