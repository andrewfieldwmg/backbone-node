module.exports = {

        encrypt: function(crypto, algorithm, password, text) {
          var cipher = crypto.createCipher(algorithm,password)
          var crypted = cipher.update(text,'utf8','hex')
          crypted += cipher.final('hex');
          
          return crypted;
        },
         
        decrypt: function(crypto, algorithm, password, text) {
          var decipher = crypto.createDecipher(algorithm,password)
          var dec = decipher.update(text,'hex','utf8')
          dec += decipher.final('utf8');
          
          return dec;
        },

        processUserLogin: function(io, socket, data, User, crypto, algorithm, password) {
                
                var self = this;
                
               var encryptedPasswordInput = self.encrypt(crypto, algorithm, password, data.loginPassword);
                
                var user = User.build();
                        
                user.retrieveByEmailAndPassword(data.loginEmail, encryptedPasswordInput, function(userModel) {
        
                        if (userModel) {
                                
                                console.log('user found!');
                                
                               socket.emit('user-login-success', {
                                    userModel: JSON.stringify(userModel)
                               });
                
                        } else {
                                
                                console.log('user not found!');
                                
                                socket.emit('user-login-failure');
                
                        }
                                                                                        
                                                        
                }, function(error) {
                     
                });

        
        },
    
        processNewUserEmail: function(io, socket, data, User, utils) {
                               
                user = User.build();
                
                user.retrieveByEmail(data.userEmail, function(userModel) {
       
                           if (userModel) {
                                
                               socket.emit('user-email-taken');
                               //return;
            
                           } else {
                                                        
                                var userColour = utils.colors[Math.floor(Math.random()*utils.colors.length)];           
                                
                                var user = User.build({
                                                email: data.userEmail,
                                                socketId: socket.id,
                                                status: "online",
                                                userColour: userColour
                                                });
                                    
                                    user.add(function(success) {
                                        
                                        socket.emit('user-email-stored', { userId: success.id });
                                        socket.userId = success.id;
                             
                                    },
                                    
                                function(err) {
                                
                                    
                                });
                                
          
                           }                                                                                 
                                                                   
       
                     }, function(error) {
                        
                   });
                
                  
        
    },
    
        
    processNewUsername: function(io, socket, data, User) {

        user = User.build();
        
        user.retrieveByUsername(data.username, function(userModel) {

                   if (userModel) {
                        console.log('user name taken');
                       socket.emit('username-taken');
                       
    
                   } else {
                                                              
                        var user = User.build();	
                          
                        user.username = data.username;
                        
                        user.updateUsernameById(data.userId, function(success) {
                            
                                if (success) {
                                        console.log('user name stored');
                                        socket.emit('username-stored');
                                        
                                } else {
                                 
                                }
                          }, function(error) {
                                
                          });
                  
                        
  
                   }                                                                                 
                                                           

             }, function(error) {
                
           });
                                              
    
    },
    
    processNewUserGenre: function(io, socket, data, User) {
                                   
                var user = User.build();	
                  
                user.userGenre = data.userGenre;
                
                user.updateUserGenreById(data.userId, function(success) {
                    
                        if (success) {	
                                socket.emit('user-genre-stored');
                        } else {
                         
                        }
                        
                  }, function(error) {
                        
                  });
                  
        
    },
    
    processNewUserLocation: function(io, socket, data, User) {
        
                 var user = User.build();	
                  
                user.userLocation = data.userLocation;
                
                user.updateUserLocationById(data.userId, function(success) {
                    
                        if (success) {	
                                socket.emit('user-location-stored');
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
                                        
                                socket.emit('user-profile-image-stored');
                                         
                        });
                    
                });
    
    
    },

    
    processNewUserPassword: function(io, socket, data, User, crypto, algorithm, password) {
    
                var self = this;
                
               var user = User.build();	
                  
                user.password = self.encrypt(crypto, algorithm, password, data.userPassword);
                
                
                user.updateUserPasswordById(data.userId, function(success) {
                    
                        if (success) {	
                                socket.emit('user-password-stored');
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
    
    updateConnectedClientsInChannel: function(io, socket, Channel, User, utils, channelIds) {
                      
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
                                
                                    var channelIdsArray = JSON.parse(channelIds);
                                    
                                        for(i = 0; i < channelIdsArray.length; i++) {
                                            
                                        ////console.log(channelIdsArray[i]);
                                        //console.log('emitting clients IN CHANNEL to: ' + channelIdsArray[i] + '-' + JSON.stringify(users));
                                                 
                                                 io.to(channelIdsArray[i]).emit('connected-clients-in-channel', {
                                                              usersInChannel: JSON.stringify(users),
                                                              channelId: channelIdsArray[i]
                                                 });
                                            }
                                
                        
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