    //CONFIG
    var config = require('./config');
    var utils = require('./utils');

    //EXPRESS
    var express = require('express');
    
    //START THE API
    //var api = express();
    //module.exports.api = api;
    //require("./api.js");
    
    //SOCKET IO
    var socketApp = express();
    var socketio_app = socketApp.listen(8080);
    var io = require('socket.io')(socketio_app);
    var ss = require('socket.io-stream');
    
    //UTILS
    var ip = require("ip");
    var im = require('imagemagick');
    
    //AUDIO
    var SoxCommand = require('sox-audio');
    
    // FILE SYSTEM and STREAMS
    var fs = require('fs');
    var path = require("path");
    var mime = require('mime');
    var sanitize = require("sanitize-filename");

    //DB MODELS//
    var User = require("./models/user.js");
    var Message = require("./models/message.js");
    var Channel = require("./models/channel.js");
    var File = require("./models/file.js");
    var Stream = require("./models/stream.js");
    
    //DIRS and FILE VARS (to do: add these to a config.json)
    
    var audioPath = path.join(config.filePaths.uploadDir + '/audio');
    var wavRecordingFilename = 'liveStream.wav';
    var mp3RecordingFilename = 'liveStream.mp3';
    var wavRecordingFile = audioPath + '/' + wavRecordingFilename;
    var mp3RecordingFile = audioPath + '/' + mp3RecordingFilename;


    //FILE TRANSFER//
    socketApp.get('/api/download', function (req, res) {
        
        var requestedFile = decodeURIComponent(req.query.file);
       
        var file = config.filePaths.uploadDir + "/" + requestedFile;
    
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
    
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
    
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      
    });

 
    ///SOCKET IO BELOW THIS POINT///
    
    //var connectedSocketIds = [];
    //var connectedUsernames = [];
    //var connectedUserIds = [];

    io.sockets.on('connection', function (socket) {
               
        //console.log('socket connected');
  
        //connectedSocketIds.push(socket.id);
             
        var clientIp = socket.request.connection.remoteAddress;
        //var socketIndex = connectedSocketIds.indexOf(socket.id);

        var handshake = socket.handshake;
        var username = handshake.query.username;
        var userId = handshake.query.userId;
        var channelIds = handshake.query.channelIds;
        var channelName = handshake.query.channelName;
        var userColour = handshake.query.userColour;
        
         //user is NEW, so needs a new "account"...
         
        socket.on('new-username', function (data) {
            
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
                
                //////console.log("New socket user created!");
                
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
              
        
        });
        
         
         socket.on('new-user-genre', function (data) {
            
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
            
         });
         
        
        socket.on('new-user-location', function (data) {
            
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
            
         });
        
        
        ss(socket).on('new-user-profile-image', function(fileStream, data) {
            
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
                    
                    
        });
        
        
        socket.on('new-user-email', function (data) {
            
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
            
         });
        
        
        socket.on('new-user-password', function (data) {
      
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
            
         });
        
        
        function updateConnectedClientsInChannel(channelIds, channelName) {
                                                
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
                                        ////console.log('emitting clients IN ROOM to: ' + channelNameArray[i] + '-' + JSON.stringify(users));
                                             
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
                
                                    
        }
        
        
        
    socket.on('check-user-status', function (data) {
        
            var user = User.build();
            user.retrieveById(data.userIdToCheck, function(userModel) {
           
                   if (userModel) {
                                    
                        socket.emit('check-user-status-success', {userStatusResult: userModel.status});
                            
                   } else {
    
                   }
             }, function(error) {
                
            });
    
    });
            
        
    socket.on('refresh-connection', function(data) {
       
        //console.log('refresh connection');
        
        var username = data.username;
        var userId = data.userId;
        var channelIds = data.channelIds;
        var channelName = data.channelName;
        var userColour = data.userColour;
        
        if(userId !== "null" && username !== "null") {
            
                ////console.log('already registered');
                
            //if the user has an ID and a username
            //that means he's "registered" his "account" before
            //so we only must update his socket id
            
            ////console.log(channelName);
        
                /*if(typeof channelName !== 'undefined' && channelName !== null && channelName !== "null") {
                    
                    ////console.log('channelname is not null');
                 // then the user hs been in at least one channel before
                 // so we re-join him to them - thus persisting the application state
                 // across page reloads and sessions
    
                    socketChannelNamesArray = [];    
                    var joinedChannelArray = JSON.parse(channelName);
                   
                    for(i = 0; i < joinedChannelArray.length; i++) {
                    
                        socket.join(joinedChannelArray[i]);
                        ////console.log('socket joined!!!!: ' + joinedChannelArray[i]);
                        socketChannelNamesArray.push(joinedChannelArray[i]);
                    }
                    
                    socket.channelNames = Array.from(new Set(utils.flatten(socketChannelNamesArray)));
                
                } else {
                     ////console.log('channelname is null');
                }*/
                
                if(typeof channelIds !== 'undefined' && channelIds !== null && channelIds !== "null") {
                    
                    ////console.log('channelids is not null');
                 // then the user hs been in at least one channel before
                 // so we re-join him to them - thus persisting the application state
                 // across page reloads and sessions
    
                    socketChannelIdsArray = [];    
                    var joinedChannelIdsArray = JSON.parse(channelIds);
                   
                    for(i = 0; i < joinedChannelIdsArray.length; i++) {
                        socket.join(joinedChannelIdsArray[i]);
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
                     
                                    } else {
                   
                                    }
                              }, function(error) {
                                 
                                });

                            
                            //var uniqueUsernameArray = Array.from(new Set(connectedUsernames));
                            
                            //////console.log('emit connected clients');
                            
                                user.retrieveAll(function(users) {
                
                                if (users) {
                        
                                    io.sockets.emit('connected-clients', {connectedUsers: JSON.stringify(users)});
                                                                
                                   ////console.log(channelIds);
                                   
                                   if(typeof channelIds !== "undefined" && channelIds !== null && channelIds !== "null"
                                      && typeof channelName !== "undefined" && channelName !== null && channelName !== "null") {
                                    
                                    ////console.log('channel ids:' + channelIds);
                                        
                                    updateConnectedClientsInChannel(channelIds, channelName);
                                                                                   
                                                     
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
                                                
                                                if (JSON.parse(channels[i].usersInChannel).indexOf(userId) != -1 ) {
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
                                    
                        }
                        
                                        
                        } else {
                            
                                ////console.log("User not found");
                                
                        }
                        
                  }, function(error) {
                    
                  });
                    
                                    var stream = Stream.build();
             
                                     stream.retrieveAll(function(streams) {
                                         
                                         if (streams) {
                                                    
                                                //socket.emit('emptyMessages');
                                            
                                                    
                                                    //console.log('emitting mess ' + messages[i].message);
                                                    
                                                    socket.emit('available-streams', {
                                                        availableStreams: JSON.stringify(streams)
                                                    });
                                                                                                   
                                                
                                         } else {
                                           //res.send(401, "User not found");
                                         }
                                         
                                   }, function(error) {
                                         //res.send("User not found");
                                   });
         

        }


    
    });
               
                              
        String.prototype.stripSlashes = function(){
           return this.replace(/\\(.)/mg, "$1");
       }

        socket.on('create-channel-and-invite-user-in', function (data) {
            
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
                                                             
                            user.status = "online";
                            user.socketId = socket.id;
                            user.inChannels = JSON.stringify(channelsForUserArray);
                            
                            user.updateById(data.createdByUserId, function(success) {
                                
                                    if (success) {	
                                            //var channelsForUser = [];  
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

     
                socket.join(success.id);
                //////console.log(socket);
                
                socketChannelIdsArray = [];
                if (typeof socket.channelIds === "undefined") {
                    ////console.log('socket channelids undefined');
                    socketChannelIdsArray.push(success.id);
                } else {
                    ////console.log('socket channelids NOT undefined');
                    socketChannelIdsArray.push(socket.channelIds);
                    socketChannelIdsArray.push(success.id);
                }
                
                socket.channelIds = Array.from(new Set(utils.flatten(socketChannelIdsArray)));
                
                ////console.log(socket.channelIds);
                
                /*socketChannelNamesArray = [];
                if (typeof socket.channelNames === "undefined") {
                    ////console.log('socket channelnames undefined');
                    socketChannelNamesArray.push(data.name);
                } else {
                    ////console.log('socket channelnames NOT undefined');
                    socketChannelNamesArray.push(socket.channelNames);
                    socketChannelNamesArray.push(data.name);
                }
                
                socket.channelNames = Array.from(new Set(utils.flatten(socketChannelNamesArray)));*/
                
                ////console.log(socket.channelNames);
                
                socket.emit('joined-channel-await-others', {
                    channelName: data.name,
                    channelId: success.id,
                    targetUsername: data.targetUsername
                    });
                
                
                var user = User.build();
                
                user.retrieveById(data.targetUserId, function(users) {
                        
                        if (users) {
                            ////console.log('sending invitation to userid ' + users.id + ' on socketid ' + users.socketId);
                            io.to(users.socketId).emit('channel-invitation', {
                                                      channelName: data.name,
                                                       channelId: success.id,
                                                       invitedByUserId: data.createdByUserId,
                                                       invitedByUsername: data.createdByUsername
                                                       });
                        } else {
                          //res.send(401, "User not found");
                        }
                  }, function(error) {
                        //res.send("User not found");
                  });
       
                             
            var usersInChannel = [];
            
            },
            
            function(err) {
                
                ////console.log("New channel could NOT be created!");
                            
                var usersInChannel = [];
            
            });
              
        
        });
        
        
        
        socket.on('create-channel', function (data) {
            
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
                                                             
                            user.status = "online";
                            user.socketId = socket.id;
                            user.inChannels = JSON.stringify(channelsForUserArray);
                            
                            user.updateById(data.createdByUserId, function(success) {
                                
                                    if (success) {	
                                            //var channelsForUser = [];  
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

     
                socket.join(success.id);
      
                socketChannelIdsArray = [];
                if (typeof socket.channelIds === "undefined") {
                    socketChannelIdsArray.push(success.id);
                } else {
                    socketChannelIdsArray.push(socket.channelIds);
                    socketChannelIdsArray.push(success.id);
                }
                
                socket.channelIds = Array.from(new Set(utils.flatten(socketChannelIdsArray)));
                
                /*socketChannelNamesArray = [];
                if (typeof socket.channelNames === "undefined") {
                    socketChannelNamesArray.push(data.name);
                } else {
                    socketChannelNamesArray.push(socket.channelNames);
                    socketChannelNamesArray.push(data.name);
                }
                
                socket.channelNames = Array.from(new Set(utils.flatten(socketChannelNamesArray)));*/
                
                ////console.log(socket.channelNames);
    
                socket.emit('channel-ready', {
                                   channelId: success.id,
                                   channelName: channel.name,
                                   usersInChannel: channel.usersInChannel
                                   });
                             
                             
            var usersInChannel = [];
            
            },
            
            function(err) {
                
                ////console.log("New channel could NOT be created!");
                            
                var usersInChannel = [];
            
            });
              
        
        });
         
         
         
         
        socket.on('join-channel', function (data) {
            
        //////console.log("join channels");
                                                               
          var user = User.build();
            
            user.retrieveById(data.joinerUserId, function(users) {
                
                    if (users) {
                        
                        var channelsForUserArray = [];
                        ////console.log('usersinchannel' + users.inChannels);
                        
                        if(typeof users.inChannels === 'undefined' || users.inChannels == null || users.inChannels == "null") {
                           
                            ////console.log('no inChannel');
                             channelsForUserArray.push(data.joiningChannelId.toString());
                            
                        } else {
                            
                            //console.log('already inChannel');
                            
                            var parsedInChannels = JSON.parse(users.inChannels);
                            ////console.log(parsedInChannels);
                            for(i = 0; i < parsedInChannels.length; i++) {
                                channelsForUserArray.push(parsedInChannels[i].toString());
                            }
                            
                            channelsForUserArray.push(data.joiningChannelId.toString());
                            
                        }
                        
                                user.status = "online";
                                user.socketId = socket.id;
                                user.inChannels = JSON.stringify(channelsForUserArray);
                                
                                user.updateById(data.joinerUserId, function(success) {
                                    
                                        if (success) {	
                                                //var channelsForUser = [];  
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
            
            
            
                var channel = Channel.build();
                
                channel.retrieveById(data.joiningChannelId, function(channelsOne) {
                        
                    if (channelsOne) {				
                      
                      usersInChannel = JSON.parse(channelsOne.usersInChannel);
                      usersInChannel.push(data.joinerUserId.toString());
                      
                      userModelsInChannel = JSON.parse(channelsOne.userModelsInChannel);
                      userModelsInChannel.push(JSON.parse(data.joinerUserModel));
          
                      var uniqueUsersInChannel = Array.from(new Set(usersInChannel));
                      var uniqueUserModelsInChannel = Array.from(new Set(userModelsInChannel));
                        
                        channel.usersInChannel = JSON.stringify(uniqueUsersInChannel);
                        channel.userModelsInChannel = JSON.stringify(uniqueUserModelsInChannel);
                        
                        channel.name = channelsOne.name;
                        
                        channel.updateById(data.joiningChannelId, function(success) {
                                
                                if (success) {
                                    //////console.log(success);
 
                                    socket.join(data.joiningChannelId);
                                    
                                     socketChannelIdsArray = [];
                                    if (typeof socket.channelIds === "undefined") {
                                        ////console.log('socket channelids undefined');
                                        socketChannelIdsArray.push(data.joiningChannelId);
                                    } else {
                                        ////console.log('socket channelids NOT undefined');
                                        socketChannelIdsArray.push(socket.channelIds);
                                        socketChannelIdsArray.push(data.joiningChannelId);
                                    }
                                    
                                    socket.channelIds = Array.from(new Set(utils.flatten(socketChannelIdsArray)));
                                    
                                    ////console.log(socket.channelIds);
                                    
                                    /*socketChannelNamesArray = [];
                                    if (typeof socket.channelNames === "undefined") {
                                        ////console.log('socket channelnames undefined');
                                        socketChannelNamesArray.push(channelsOne.name);
                                    } else {
                                        ////console.log('socket channelnames NOT undefined');
                                        socketChannelNamesArray.push(socket.channelNames);
                                        socketChannelNamesArray.push(channelsOne.name);
                                    }
                                    
                                    socket.channelNames = Array.from(new Set(utils.flatten(socketChannelNamesArray)));*/
                                    
                                    ////console.log(socket.channelNames);
                                 
       
                                    io.to(channelsOne.name).emit('channel-ready', {
                                        channelId: data.joiningChannelId,
                                        channelName: channelsOne.name,
                                        usersInChannel: channel.usersInChannel
                                        
                                        });
                                    
                                        channel.retrieveAll(function(channelsTwo) {
                                            
                                            if (channelsTwo) {
                                                
                                                var channelArray = [];
                                                for(i = 0; i < channelsTwo.length; i++) {
                                                    
                                                    channelArray.push(channelsTwo[i]);
                                                    
                                                    //////console.log(channelArray);
                                                    //////console.log('emitting available-channels: ' + JSON.stringify(channelArray));
                                                    
                                                    // io.to(channelsTwo.name).emit('available-channels', {availableChannels: JSON.stringify(channelArray) });
                                                }

                                              //io.sockets.emit('available-channels', {availableChannels: JSON.stringify(channels) });      
                                            } else {
                                              //res.send(401, "User not found");
                                            }
                                      }, function(error) {
                                            //res.send("User not found");
                                      });
                                        
                                        //res.json({ message: 'User updated!' });
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
                 
        });
        
        
        socket.on('decline-channel-invitation', function (data) {
            
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
            
        });
        
        
        //userIdsInChannelArray = [];
        //usernamesInChannelArray = [];
         
        //usersArray = [];
        
        socket.on('enter-channel', function (data) {
  
         ////console.log('enter-channel');
         ////console.log(data);
         
            var channelId = data.channelId;
            socket.join(channelId);
       
            var channel = Channel.build();
            
            channel.retrieveById(channelId, function(channels) {
                
                    if (channels) {
                        
                        socket.emit('entered-channel-details', {channelId: channelId, channelName: channels.name});
                        
                        var usersInChannel = JSON.parse(channels.usersInChannel);
      
                            var user = User.build();
       
                               user.findAllWhere(usersInChannel, function(users) {
                                       
                                        if (users) {
                                        
                                            updateConnectedClientsInChannel(JSON.stringify(channelId), JSON.stringify(channels.name));
                                                
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
                                                                          
                                                    if (JSON.parse(channelsTwo[i].usersInChannel).indexOf(data.userEnteringChannel) != -1 ) {
                                                       channelArray.push(channelsTwo[i]);
                                                    }
                                                    
                                                    allChannelsArray.push(channelsTwo[i]);
                               
                                                }                                            
                                                                 
                                                var uniqueChannelArray = Array.from(new Set(channelArray));
                                                var uniqueAllChannelsArray = Array.from(new Set(allChannelsArray));
                                                
                                                    //////console.log(channelArray);
                                                    ////console.log('emitting available-channels: ' + JSON.stringify(uniqueChannelArray));
                                                    
                                                    socket.emit('user-channels', {
                                                      availableChannels: JSON.stringify(uniqueChannelArray)
                                                    });
                                                   
                                                   socket.emit('available-channels', {availableChannels: JSON.stringify(uniqueAllChannelsArray) });
                                                   
                                                    var channelArray = [];
                                                    var allChannelsArray = [];
                                                    
                                                    
                                              //io.sockets.emit('available-channels', {availableChannels: JSON.stringify(channels) });      
                                            } else {
                                              //res.send(401, "User not found");
                                            }
                                            
                                      }, function(error) {
                                            //res.send("User not found");
                                      });

           
           
                                    var message = Message.build();
             
                                     message.findAllWhere(channelId, null, function(messages) {
                                         
                                         if (messages) {
                                                    
                                                socket.emit('emptyMessages');
                                                    
                                                for(i = 0; i < messages.length; i++) {
                                                    
                                                    //console.log('emitting mess ' + messages[i].message);
                                                    
                                                    socket.emit('message', {
                                                        channelId: messages[i].channelId,
                                                        messageId: messages[i].id,
                                                        message: messages[i].message,
                                                        username: messages[i].username,
                                                        userId: messages[i].userId,
                                                        userColour: messages[i].userColour
                                                    });
                                                    
                                                    
                                                }                                                 
                                                
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

            
        });
        
            
            socket.on('set-volume', function (data) {
               socket.emit('set-volume', { newVolume: data.newVolume}); 
            });
            
  
             socket.on('message', function (data) {
           
              console.log('Received a message!' + data.message);
                
                var message = data.message;
                var userId = data.userId;
                var username = data.username;
                var activeChannelId = data.activeChannelId;
                var activeChannelName = data.activeChannelName;
                var userColour = data.userColour;
  
                //var socketIndex = connectedSocketIds.indexOf(socket.id);
                
                var message = Message.build({
                                    message: message,
                                    userId: userId,
                                    username: username,
                                    userColour: userColour,
                                    socketId: socket.id,
                                    channelId: data.activeChannelId,
                                    channelName: data.activeChannelName
                                    });
              
              message.add(function(success) {
                           
                   //socket.broadcast.emit('message', { message: message, sender: sender });
                  io.to(activeChannelId).emit('message', {
                        channelId: data.activeChannelId,
                        message: data.message,
                        username: username,
                        userId: userId,
                        userColour: userColour
                    });
                  
                    var channel = Channel.build(); 
                    channel.incrementMessageCount(data.activeChannelId);
                                    
                    channel.retrieveById(data.activeChannelId, function(channels) {
                          
                              if (channels) {				
                                    //console.log('message count updated');
                                  io.to(activeChannelId).emit('message-count-updated', {
                                    channelId: data.activeChannelId,
                                    messageCount: channels.messageCount
                                  });
                              
                              } else {
                               
                              }
                              
                        }, function(error) {
                             
                        });
              
                      
                },
                function(err) {
                    ////console.log("New message NOT written to database");
                });
    
            
             
             });
                 
              
              
            ss(socket).on('file-upload', function(fileStream, data) {
                
                //var socketIndex = connectedSocketIds.indexOf(socket.id);
       
                socket.broadcast.to(data.activeChannelName).emit('sent-file-incoming', {
                    username: data.username,
                    userColour: data.userColour,
                    sender: data.sender,
                    name: data.name
                    });
                
                var cleanName = sanitize(data.name);
     
                 fileUploadWriteStream = fs.createWriteStream(config.filePaths.uploadDir + "/" + cleanName);
                 
                 fileStream.pipe(fileUploadWriteStream);
                 
                    fileStream.on('end', function() {
                        
                        var file = File.build({
                                              filename: data.name,
                                              uploadedByUserId: data.userId,
                                              uploadedByUsername: data.username,
                                              channelId: data.activeChannelId,
                                              channelName: data.activeChannelName,
                                              downloadedBy: ""
                                              });
                        
                          file.add(function(success) {
                            
                              //////console.log('File successfully uploaded: ' + cleanName);
                            var message = Message.build({
                                            message: "File Transfer: " + data.name,
                                            userId: data.userId,
                                            username: data.username,
                                            userColour: data.userColour,
                                            socketId: socket.id,
                                            channelId: data.activeChannelId,
                                            channelName: data.activeChannelName
                                            });
              
                            message.add(function(success) {
              
                                              //TELL SENDER IT'S DONE//
                                            socket.emit('file-transfer-finished', {
                                                        username: data.username,
                                                        userColour: data.userColour,
                                                        //socketindex: socketIndex,
                                                        sender: data.sender,
                                                        name: cleanName
                                                        });
                                            
                                            //SEND THE FILE URL TO THE OTHER(S)//
                                            socket.broadcast.to(data.activeChannelName).emit('sent-file', {
                                                username: data.username,
                                                userColour: data.userColour,
                                                //socketindex: socketIndex,
                                                sender: data.sender,
                                                name: cleanName
                                                });
                                                            
                                                            
                                    var channel = Channel.build(); 
                                    channel.incrementMessageCount(data.activeChannelId);
                                                    
                                    channel.retrieveById(data.activeChannelId, function(channels) {
                                          
                                              if (channels) {				
                      
                                                  io.to(data.activeChannelName).emit('message-count-updated', {
                                                    channelId: data.activeChannelId,
                                                    messageCount: channels.messageCount
                                                  });
                                              
                                              } else {
                                               
                                              }
                                              
                                        }, function(error) {
                                             
                                        });
                        
                                    
                              },
                              function(err) {
                                  ////console.log("New message NOT written to database");
                              });
                            
            
             
                          },
                          function(err) {
                              ////console.log("New message NOT written to database");
                          });
          
                     
                    });
        
        
            });
    
        
    /////AUDIO STREAMS/////
    
    ss(socket).on('audio-file', function(inbound_stream, data) {
            
        ////console.log('receiving file stream: ' + data.name);
                
            //var socketIndex = connectedSocketIds.indexOf(socket.id);          
            var mimeType = data.type;             
            var senderSocketId = socket.id;
            var activeChannelName = data.activeChannelName;
            var userColour = data.userColour;
            var justFilename = data.name.slice(0, -4);
          
                var stream = Stream.build({
                                      filename: data.name,
                                      state: "live",
                                      genre: data.genre,
                                      upvotes: 0,
                                      streamedByUserId: data.userId,
                                      streamedByUsername: data.username,
                                      channelId: data.activeChannelId,
                                      channelName: data.activeChannelName
                                      });
                
                stream.add(function(success) {
                        
                        var streamId = success.id;
                           //////console.log('File successfully uploaded: ' + cleanName);
                        var message = Message.build({
                                        message: "Audio Stream: " + data.name,
                                        userId: data.userId,
                                        username: data.username,
                                        userColour: data.userColour,
                                        socketId: socket.id,
                                        channelId: data.activeChannelId,
                                        channelName: data.activeChannelName
                                        });
          
                        message.add(function(success) {                 
                            
                            var parameters = {
                                        userColour: userColour,
                                        audioType: mimeType,
                                        //socketindex: socketIndex,
                                        username: data.username,
                                        sender: data.sender,
                                        name: data.name
                                        };
                                        
                               if(data.liveStream === "true") {      

                                    socket.broadcast.to(data.activeChannelId).emit('audio-file-incoming', parameters);
                               
                               } else {
                                
                                    io.to(data.activeChannelId).emit('audio-file-incoming', parameters);
                                
                               }
                               
                                    var channel = Channel.build(); 
                                    channel.incrementMessageCount(data.activeChannelId);
                                                    
                                    channel.retrieveById(data.activeChannelId, function(channels) {
                                          
                                              if (channels) {				
                      
                                                  io.to(data.activeChannelId).emit('message-count-updated', {
                                                    channelId: data.activeChannelId,
                                                    messageCount: channels.messageCount
                                                  });
                                              
                                              } else {
                                               
                                              }
                                              
                                        }, function(error) {
                                             
                                        });
                                    
                                    
                                var stream = Stream.build();
             
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
         
                               
                          },
                          function(err) {
                              ////console.log("New message NOT written to database");
                          });
       
       
                    startStream(streamId);
                    
              },
              function(err) {
                  ////console.log("New message NOT written to database");
              });

         
                        
            /*var decoder = new lame.Decoder();
                      
            var encoder = new lame.Encoder({
              // input 
              channels: 2,        // 2 channels (left and right) 
              bitDepth: 16,       // 16-bit samples 
              sampleRate: 44100,  // 44,100 Hz sample rate 
             
              // output 
              bitRate: 128,
              outSampleRate: 44100,
              mode: lame.STEREO // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO 
            });*/
            
            
         function startStream(streamId) {
                     
            var offlineFile = fs.createWriteStream(audioPath + "/" + streamId + ".mp3");
      
            const Writable = require('stream').Writable;
                
                var buffer = [];
         
                const socketSendWritableMp3 = new Writable({
                    
                  write(chunk, encoding, callback) {
                    
                    buffer.push(chunk);
                     //////console.log(chunk);
                     
                    offlineFile.write(chunk);
        
                    if(buffer.length >= 40) {
                        
                        var bufferConcat = Buffer.concat(buffer);
                        
                          if(data.liveStream === "true") {      

                                    socket.broadcast.to(data.activeChannelId).emit('audio', { buffer: bufferConcat});
                               
                               } else {
                                
                                    io.to(data.activeChannelId).emit('audio', { buffer: bufferConcat});
                                
                               }
                            
                             //socket.broadcast.emit('audio', { buffer: bufferConcat});                      
                              
                       buffer = [];
                    }
                
                    callback();
                  }
                
                });
                    
            //not using this right now, but could come in handy!      
            const Transform = require('stream').Transform;
              
            const transformWav = new Transform({
              write(chunk, encoding, callback) {
             
                this.push(new Buffer(chunk, 'binary'));
            
                callback();
              }
            });
            

              if (mimeType === 'audio/wav/stream') {
                
                ////console.log('audio/wav/stream');
           
                    var command = SoxCommand();
                    
                    command.input(inbound_stream)
                        .inputFileType('raw')
                        .inputSampleRate('88.2k')
                        .inputEncoding('signed')
                        .inputBits(16)
                        .output(socketSendWritableMp3)
                        .outputBits(16)
                        .outputFileType('mp3')
                        .outputSampleRate('44.1k')
                        .outputBitRate('128')
                    
                    command.run();
      
                } else if (mimeType === 'audio/wav') {                 
                                     
                    ////console.log('audio/wav');
                    
                  var command = SoxCommand();
                    
                    command.input(inbound_stream)
                        .inputFileType('wav')
                        .output(socketSendWritableMp3)
                        .outputBits(16)
                        .outputFileType('mp3')
                        .outputSampleRate('44.1k')
                        .outputBitRate('128');
                     
                    command.run();
                  
                } else if (mimeType === 'audio/mp3') {
                    
                    //console.log('audio/mp3');
                    inbound_stream.pipe(socketSendWritableMp3);
                  
                }
                
                
                                 ////console.log('sending stream to client(s): '  + data.name);
                            
                        socket.on('stop-audio-stream', function (data) {
                            
                            var proc = require('child_process').spawn('sox');
                            proc.kill('SIGINT');
                 
                            ////console.log('Stopping stream from stop message INSIDE stream');  
           
                            inbound_stream.read(0);
                            inbound_stream.push(null);
                            inbound_stream.end();
                            inbound_stream.destroy();
                            
                            //offlineFile.end();

                            buffer = [];
                            
                            var stream = Stream.build();	
                      
                                stream.state = "offline";
                                
                                stream.updateStateById(streamId, function(success) {
                          
                                    if (success) {

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
                            
                            //socket.disconnect();

                        });
    
                           
                        inbound_stream.on('end', function() {
                                ////console.log('Inbound audio stream ended: ' + data.name);
                                                      
                                var stream = Stream.build();	
                      
                                stream.state = "offline";
                                
                                stream.updateStateById(streamId, function(success) {
                          
                                    if (success) {
               
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
                            
                        });
                
        }
         

                
                
                      return inbound_stream;
                      
                });
                 
         
         
                socket.on('disconnect', function() {
                        
                    var proc = require('child_process').spawn('sox');
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
                          

                      
                });
                   
                         
                socket.on('stop-audio-stream', function (data) {

                    ////console.log('Stopping stream from stop message OUTSIDE stream');   
                    
                    io.sockets.emit('stop-audio-stream');

                });
    
                
    });


    // Error handler:
    io.sockets.on("error", function(event){
        ////console.log("Error from uploader", event);
    });
    
    
    io.sockets.on('disconnect',function(){
          ////console.log('SocketIO client disconnected - all sockets');
    });
        
