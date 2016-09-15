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
    var Room = require("./models/room.js");
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
        var roomIds = handshake.query.roomIds;
        var roomName = handshake.query.roomName;
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
        
        
        function updateConnectedClientsInRoom(roomIds, roomName) {
                                                
                var room = Room.build();
                
                room.findAllWhere(JSON.parse(roomIds), function(rooms) {
                   
                    if (rooms) {

                        usersInRoomArray = [];     
                        for(i = 0; i < rooms.length; i++) {
                           usersInRoomArray.push(JSON.parse(rooms[i].usersInRoom)); 
                        }
                        
                        var uniqueFlatUsersInRoomArray = Array.from(new Set(utils.flatten(usersInRoomArray)));
                        ////console.log(uniqueFlatUsersInRoomArray);
                        
                       var user = User.build();

                        user.findAllWhere(uniqueFlatUsersInRoomArray, function(users) {
                            
                            if (users) {
                            
                              var roomNameArray = JSON.parse(roomName);
                                var roomIdsArray = JSON.parse(roomIds);
                                
                                        for(i = 0; i < roomNameArray.length; i++) {
                                        
                                        ////console.log(roomIdsArray[i]);
                                        ////console.log('emitting clients IN ROOM to: ' + roomNameArray[i] + '-' + JSON.stringify(users));
                                             
                                             io.to(roomNameArray[i]).emit('connected-clients-in-room', {
                                                          usersInRoom: JSON.stringify(users),
                                                          roomName: roomNameArray[i]
                                             });
                                        }
                            
                                    roomNameArray = [];
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
        
            
            
        function updateConnectedClientsInRoom2(roomIds, roomName) {
                                                
                var room = Room.build();
                
                room.findAllWhere(JSON.parse(roomIds), function(rooms) {
                   
                    if (rooms) {

                        usersInRoomArray = [];
                        
                        for(i = 0; i < rooms.length; i++) {
                            
                            io.to(rooms[i].name).emit('connected-clients-in-room', {
                                    usersInRoom: JSON.stringify(rooms[i].userModelsInRoom),
                                    roomName: rooms[i].name
                            });
                          
                        }
                        
      
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
        var roomIds = data.roomIds;
        var roomName = data.roomName;
        var userColour = data.userColour;
        
        if(userId !== "null" && username !== "null") {
            
                ////console.log('already registered');
                
            //if the user has an ID and a username
            //that means he's "registered" his "account" before
            //so we only must update his socket id
            
            ////console.log(roomName);
        
                if(typeof roomName !== 'undefined' && roomName !== null && roomName !== "null") {
                    
                    ////console.log('roomname is not null');
                 // then the user hs been in at least one room before
                 // so we re-join him to them - thus persisting the application state
                 // across page reloads and sessions
    
                    socketRoomNamesArray = [];    
                    var joinedRoomArray = JSON.parse(roomName);
                   
                    for(i = 0; i < joinedRoomArray.length; i++) {
                    
                        socket.join(joinedRoomArray[i]);
                        ////console.log('socket joined!!!!: ' + joinedRoomArray[i]);
                        socketRoomNamesArray.push(joinedRoomArray[i]);
                    }
                    
                    socket.roomNames = Array.from(new Set(utils.flatten(socketRoomNamesArray)));
                
                } else {
                     ////console.log('roomname is null');
                }
                
                if(typeof roomIds !== 'undefined' && roomIds !== null && roomIds !== "null") {
                    
                    ////console.log('roomids is not null');
                 // then the user hs been in at least one room before
                 // so we re-join him to them - thus persisting the application state
                 // across page reloads and sessions
    
                    socketRoomIdsArray = [];    
                    var joinedRoomIdsArray = JSON.parse(roomIds);
                   
                    for(i = 0; i < joinedRoomIdsArray.length; i++) {
                    
                        socketRoomIdsArray.push(joinedRoomIdsArray[i]);
                    }
                    
                    socket.roomIds = Array.from(new Set(utils.flatten(socketRoomIdsArray)));
                
                } else {
                     ////console.log('roomids is null');
                }

            
                    socket.userId = userId;
                        
                    //connectedUsernames.push(username);
                    //connectedUserIds.push(userId);
                    
                    var user = User.build();	
                      
                    user.socketId = socket.id;
                    user.status = "online";
                    user.inRooms = roomIds;
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
                                                                
                                   ////console.log(roomIds);
                                   
                                   if(typeof roomIds !== "undefined" && roomIds !== null && roomIds !== "null"
                                      && typeof roomName !== "undefined" && roomName !== null && roomName !== "null") {
                                    
                                    ////console.log('room ids:' + roomIds);
                                        
                                    updateConnectedClientsInRoom(roomIds, roomName);
                                                                                   
                                                     
                                   }
     
                      
                            } else {
                              //res.send(401, "User not found");
                            }
                                
                      }, function(error) {
                        //res.send("User not found");
                     });
            
                                
                            if(typeof roomName !== "undefined" && roomName !== "null" && roomName !== null) {
                                        
                                    var room = Room.build();
                                    
                                    room.retrieveAll(function(rooms) {
                                        
                                         if (rooms) {
                                            
                                            var roomArray = [];
                                            var allRoomsArray = [];
                                            
                                            for(i = 0; i < rooms.length; i++) {
                                                
                                                if (JSON.parse(rooms[i].usersInRoom).indexOf(userId) != -1 ) {
                                                   roomArray.push(rooms[i]);
                                                }
                                                    allRoomsArray.push(rooms[i]);
                                            }
                                                     
                                                var uniqueRoomArray = Array.from(new Set(roomArray));
                                                var uniqueAllRoomArray = Array.from(new Set(allRoomsArray));
                                                
                                                var parsedRoomNames = JSON.parse(roomName);
                                                
                                                for(i = 0; i < parsedRoomNames.length; i++) {
                                                    
                                                    ////console.log('will send to: ' + parsedRoomNames[i]);
                                                    ////console.log('will send rooms: ' + JSON.stringify(uniqueRoomArray));
                                                    
                                                    socket.emit('user-rooms', {availableRooms: JSON.stringify(uniqueRoomArray) });
                                                   
                                                }
                                                
                                                 socket.emit('available-rooms', {availableRooms: JSON.stringify(uniqueAllRoomArray) });
                                                 
                                            var roomArray = [];
    
                                         } else {
                                           ////console.log("No rooms found!");
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

        socket.on('create-room-and-invite-user-in', function (data) {
            
            var usersInRoom = [];
            var userModelsInRoom = [];
            
            usersInRoom.push(data.createdByUserId);
            userModelsInRoom.push(JSON.parse(data.createdByUserModel));

            var room = Room.build({
                                  name: data.name,
                                  createdByUserId: data.createdByUserId,
                                  usersInRoom: JSON.stringify(usersInRoom),
                                  messageCount: 0,
                                  userModelsInRoom: JSON.stringify(userModelsInRoom)
                                  });
            
            room.add(function(success) {
                
            //var usersInRoom = [];
            

            var user = User.build();
            
            user.retrieveById(data.createdByUserId, function(users) {
                
                    if (users) {
                        
                        var roomsForUserArray = [];
                        ////console.log('usersinroom' + users.inRooms);
                        
                        if(typeof users.inRooms === 'undefined' || users.inRooms == null || users.inRooms == "null") {
                           
                            ////console.log('no inRoom');
                             roomsForUserArray.push(success.id.toString());
                            
                        } else {
                            
                            ////console.log('already inRoom');
                            
                            var parsedInRooms = JSON.parse(users.inRooms);
                            ////console.log(parsedInRooms);
                            for(i = 0; i < parsedInRooms.length; i++) {
                                roomsForUserArray.push(parsedInRooms[i].toString());
                            }
                            
                            roomsForUserArray.push(success.id.toString());
                            
                        }
                                                             
                            user.status = "online";
                            user.socketId = socket.id;
                            user.inRooms = JSON.stringify(roomsForUserArray);
                            
                            user.updateById(data.createdByUserId, function(success) {
                                
                                    if (success) {	
                                            //var roomsForUser = [];  
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

     
                socket.join(data.name);
                //////console.log(socket);
                
                socketRoomIdsArray = [];
                if (typeof socket.roomIds === "undefined") {
                    ////console.log('socket roomids undefined');
                    socketRoomIdsArray.push(success.id);
                } else {
                    ////console.log('socket roomids NOT undefined');
                    socketRoomIdsArray.push(socket.roomIds);
                    socketRoomIdsArray.push(success.id);
                }
                
                socket.roomIds = Array.from(new Set(utils.flatten(socketRoomIdsArray)));
                
                ////console.log(socket.roomIds);
                
                socketRoomNamesArray = [];
                if (typeof socket.roomNames === "undefined") {
                    ////console.log('socket roomnames undefined');
                    socketRoomNamesArray.push(data.name);
                } else {
                    ////console.log('socket roomnames NOT undefined');
                    socketRoomNamesArray.push(socket.roomNames);
                    socketRoomNamesArray.push(data.name);
                }
                
                socket.roomNames = Array.from(new Set(utils.flatten(socketRoomNamesArray)));
                
                ////console.log(socket.roomNames);
                
                socket.emit('joined-room-await-others', {
                    roomName: data.name,
                    roomId: success.id,
                    targetUsername: data.targetUsername
                    });
                
                
                var user = User.build();
                
                user.retrieveById(data.targetUserId, function(users) {
                        
                        if (users) {
                            ////console.log('sending invitation to userid ' + users.id + ' on socketid ' + users.socketId);
                            io.to(users.socketId).emit('room-invitation', {
                                                      roomName: data.name,
                                                       roomId: success.id,
                                                       invitedByUserId: data.createdByUserId,
                                                       invitedByUsername: data.createdByUsername
                                                       });
                        } else {
                          //res.send(401, "User not found");
                        }
                  }, function(error) {
                        //res.send("User not found");
                  });
       
                             
            var usersInRoom = [];
            
            },
            
            function(err) {
                
                ////console.log("New room could NOT be created!");
                            
                var usersInRoom = [];
            
            });
              
        
        });
        
        
        
        socket.on('create-room', function (data) {
            
            var usersInRoom = [];
            var userModelsInRoom = [];
            
            usersInRoom.push(data.createdByUserId);
            userModelsInRoom.push(JSON.parse(data.createdByUserModel));

            var room = Room.build({
                                  name: data.name,
                                  createdByUserId: data.createdByUserId,
                                  usersInRoom: JSON.stringify(usersInRoom),
                                  messageCount: 0,
                                  userModelsInRoom: JSON.stringify(userModelsInRoom)
                                  });
            
            room.add(function(success) {
                
            //var usersInRoom = [];
            

            var user = User.build();
            
            user.retrieveById(data.createdByUserId, function(users) {
                
                    if (users) {
                        
                        var roomsForUserArray = [];
                        ////console.log('usersinroom' + users.inRooms);
                        
                        if(typeof users.inRooms === 'undefined' || users.inRooms == null || users.inRooms == "null") {
                           
                            ////console.log('no inRoom');
                             roomsForUserArray.push(success.id.toString());
                            
                        } else {
                            
                            ////console.log('already inRoom');
                            
                            var parsedInRooms = JSON.parse(users.inRooms);
                            ////console.log(parsedInRooms);
                            for(i = 0; i < parsedInRooms.length; i++) {
                                roomsForUserArray.push(parsedInRooms[i].toString());
                            }
                            
                            roomsForUserArray.push(success.id.toString());
                            
                        }
                                                             
                            user.status = "online";
                            user.socketId = socket.id;
                            user.inRooms = JSON.stringify(roomsForUserArray);
                            
                            user.updateById(data.createdByUserId, function(success) {
                                
                                    if (success) {	
                                            //var roomsForUser = [];  
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

     
                socket.join(data.name);
      
                socketRoomIdsArray = [];
                if (typeof socket.roomIds === "undefined") {
                    socketRoomIdsArray.push(success.id);
                } else {
                    socketRoomIdsArray.push(socket.roomIds);
                    socketRoomIdsArray.push(success.id);
                }
                
                socket.roomIds = Array.from(new Set(utils.flatten(socketRoomIdsArray)));
                
                socketRoomNamesArray = [];
                if (typeof socket.roomNames === "undefined") {
                    socketRoomNamesArray.push(data.name);
                } else {
                    socketRoomNamesArray.push(socket.roomNames);
                    socketRoomNamesArray.push(data.name);
                }
                
                socket.roomNames = Array.from(new Set(utils.flatten(socketRoomNamesArray)));
                
                ////console.log(socket.roomNames);
    
                socket.emit('room-ready', {
                                   roomId: success.id,
                                   roomName: room.name,
                                   usersInRoom: room.usersInRoom
                                   });
                             
                             
            var usersInRoom = [];
            
            },
            
            function(err) {
                
                ////console.log("New room could NOT be created!");
                            
                var usersInRoom = [];
            
            });
              
        
        });
         
         
         
         
        socket.on('join-room', function (data) {
            
        //////console.log("join rooms");
                                                               
          var user = User.build();
            
            user.retrieveById(data.joinerUserId, function(users) {
                
                    if (users) {
                        
                        var roomsForUserArray = [];
                        ////console.log('usersinroom' + users.inRooms);
                        
                        if(typeof users.inRooms === 'undefined' || users.inRooms == null || users.inRooms == "null") {
                           
                            ////console.log('no inRoom');
                             roomsForUserArray.push(data.joiningRoomId.toString());
                            
                        } else {
                            
                            //console.log('already inRoom');
                            
                            var parsedInRooms = JSON.parse(users.inRooms);
                            ////console.log(parsedInRooms);
                            for(i = 0; i < parsedInRooms.length; i++) {
                                roomsForUserArray.push(parsedInRooms[i].toString());
                            }
                            
                            roomsForUserArray.push(data.joiningRoomId.toString());
                            
                        }
                        
                                user.status = "online";
                                user.socketId = socket.id;
                                user.inRooms = JSON.stringify(roomsForUserArray);
                                
                                user.updateById(data.joinerUserId, function(success) {
                                    
                                        if (success) {	
                                                //var roomsForUser = [];  
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
            
            
            
                var room = Room.build();
                
                room.retrieveById(data.joiningRoomId, function(roomsOne) {
                        
                    if (roomsOne) {				
                      
                      usersInRoom = JSON.parse(roomsOne.usersInRoom);
                      usersInRoom.push(data.joinerUserId.toString());
                      
                      userModelsInRoom = JSON.parse(roomsOne.userModelsInRoom);
                      userModelsInRoom.push(JSON.parse(data.joinerUserModel));
          
                      var uniqueUsersInRoom = Array.from(new Set(usersInRoom));
                      var uniqueUserModelsInRoom = Array.from(new Set(userModelsInRoom));
                        
                        room.usersInRoom = JSON.stringify(uniqueUsersInRoom);
                        room.userModelsInRoom = JSON.stringify(uniqueUserModelsInRoom);
                        
                        room.name = roomsOne.name;
                        
                        room.updateById(data.joiningRoomId, function(success) {
                                
                                if (success) {
                                    //////console.log(success);
 
                                    socket.join(roomsOne.name);
                                    
                                     socketRoomIdsArray = [];
                                    if (typeof socket.roomIds === "undefined") {
                                        ////console.log('socket roomids undefined');
                                        socketRoomIdsArray.push(data.joiningRoomId);
                                    } else {
                                        ////console.log('socket roomids NOT undefined');
                                        socketRoomIdsArray.push(socket.roomIds);
                                        socketRoomIdsArray.push(data.joiningRoomId);
                                    }
                                    
                                    socket.roomIds = Array.from(new Set(utils.flatten(socketRoomIdsArray)));
                                    
                                    ////console.log(socket.roomIds);
                                    
                                    socketRoomNamesArray = [];
                                    if (typeof socket.roomNames === "undefined") {
                                        ////console.log('socket roomnames undefined');
                                        socketRoomNamesArray.push(roomsOne.name);
                                    } else {
                                        ////console.log('socket roomnames NOT undefined');
                                        socketRoomNamesArray.push(socket.roomNames);
                                        socketRoomNamesArray.push(roomsOne.name);
                                    }
                                    
                                    socket.roomNames = Array.from(new Set(utils.flatten(socketRoomNamesArray)));
                                    
                                    ////console.log(socket.roomNames);
                                 
       
                                    io.to(roomsOne.name).emit('room-ready', {
                                        roomId: data.joiningRoomId,
                                        roomName: roomsOne.name,
                                        usersInRoom: room.usersInRoom
                                        
                                        });
                                    
                                        room.retrieveAll(function(roomsTwo) {
                                            
                                            if (roomsTwo) {
                                                
                                                var roomArray = [];
                                                for(i = 0; i < roomsTwo.length; i++) {
                                                    
                                                    roomArray.push(roomsTwo[i]);
                                                    
                                                    //////console.log(roomArray);
                                                    //////console.log('emitting available-rooms: ' + JSON.stringify(roomArray));
                                                    
                                                    // io.to(roomsTwo.name).emit('available-rooms', {availableRooms: JSON.stringify(roomArray) });
                                                }

                                              //io.sockets.emit('available-rooms', {availableRooms: JSON.stringify(rooms) });      
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
        
        
        socket.on('decline-room-invitation', function (data) {
            
            var room = Room.build();
            
            room.removeById(data.joiningRoomId, function(rooms) {
                
                    if (rooms) {
                        
                        var user = User.build();
                               
                        user.retrieveById(data.invitedByUserId, function(users) {
                            
                                if (users) {				
            
                                    io.to(users.socketId).emit('room-invitation-declined', {declinedByUsername: data.joinerUsername});
                                   
                                    socket.emit('close-room-create-modal');
                                    
                                } else {
            
                                }
                                
                          }, function(error) {
                         
                          });
                        
                             
                    } else {
                    
                    }
              }, function(error) {
                   
              });
            
        });
        
        
        //userIdsInRoomArray = [];
        //usernamesInRoomArray = [];
         
        //usersArray = [];
        
        socket.on('enter-room', function (data) {
  
         ////console.log('enter-room');
         ////console.log(data);
         
            var roomId = data.roomId;
       
            var room = Room.build();
            
            room.retrieveById(roomId, function(rooms) {
                
                    if (rooms) {
                        
                        socket.emit('entered-room-details', {roomId: roomId, roomName: rooms.name});
                        
                        var usersInRoom = JSON.parse(rooms.usersInRoom);
      
                            var user = User.build();
       
                               user.findAllWhere(usersInRoom, function(users) {
                                       
                                        if (users) {
                                        
                                            updateConnectedClientsInRoom(JSON.stringify(roomId), JSON.stringify(rooms.name));
                                                
                                                /*//console.log('emitting room clients: ' + rooms.name+JSON.stringify(users));
                                                
                                                io.to(rooms.name).emit('connected-clients-in-room', {
                                                    usersInRoom: JSON.stringify(users),
                                                    roomName: rooms.name
                                                });*/
                                  
                                       } else {
                                         //res.send(401, "User not found");
                                       }
                                       
                                 }, function(error) {
                                       //res.send("User not found");
                                 });
    
               
                                    room.retrieveAll(function(roomsTwo) {
                                                                
                                            if (roomsTwo) {
                                                
                                                var roomArray = [];
                                                var allRoomsArray = [];
                                                
                                                    for(i = 0; i < roomsTwo.length; i++) {
                                                                          
                                                    if (JSON.parse(roomsTwo[i].usersInRoom).indexOf(data.userEnteringRoom) != -1 ) {
                                                       roomArray.push(roomsTwo[i]);
                                                    }
                                                    
                                                    allRoomsArray.push(roomsTwo[i]);
                               
                                                }                                            
                                                                 
                                                var uniqueRoomArray = Array.from(new Set(roomArray));
                                                var uniqueAllRoomsArray = Array.from(new Set(allRoomsArray));
                                                
                                                    //////console.log(roomArray);
                                                    ////console.log('emitting available-rooms: ' + JSON.stringify(uniqueRoomArray));
                                                    
                                                    socket.emit('user-rooms', {
                                                      availableRooms: JSON.stringify(uniqueRoomArray)
                                                    });
                                                   
                                                   socket.emit('available-rooms', {availableRooms: JSON.stringify(uniqueAllRoomsArray) });
                                                   
                                                    var roomArray = [];
                                                    var allRoomsArray = [];
                                                    
                                                    
                                              //io.sockets.emit('available-rooms', {availableRooms: JSON.stringify(rooms) });      
                                            } else {
                                              //res.send(401, "User not found");
                                            }
                                            
                                      }, function(error) {
                                            //res.send("User not found");
                                      });

           
           
                                    var message = Message.build();
             
                                     message.findAllWhere(roomId, null, function(messages) {
                                         
                                         if (messages) {
                                                    
                                                socket.emit('emptyMessages');
                                                    
                                                for(i = 0; i < messages.length; i++) {
                                                    
                                                    //console.log('emitting mess ' + messages[i].message);
                                                    
                                                    socket.emit('message', {
                                                        roomId: messages[i].roomId,
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
                var activeRoomName = data.activeRoomName;
                var userColour = data.userColour;
  
                //var socketIndex = connectedSocketIds.indexOf(socket.id);
                
                var message = Message.build({
                                    message: message,
                                    userId: userId,
                                    username: username,
                                    userColour: userColour,
                                    socketId: socket.id,
                                    roomId: data.activeRoomId,
                                    roomName: data.activeRoomName
                                    });
              
              message.add(function(success) {
                           
                   //socket.broadcast.emit('message', { message: message, sender: sender });
                  io.to(activeRoomName).emit('message', {
                        roomId: data.activeRoomId,
                        message: data.message,
                        username: username,
                        userId: userId,
                        userColour: userColour
                    });
                  
                    var room = Room.build(); 
                    room.incrementMessageCount(data.activeRoomId);
                                    
                    room.retrieveById(data.activeRoomId, function(rooms) {
                          
                              if (rooms) {				
      
                                  io.to(activeRoomName).emit('message-count-updated', {
                                    roomId: data.activeRoomId,
                                    messageCount: rooms.messageCount
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
       
                socket.broadcast.to(data.activeRoomName).emit('sent-file-incoming', {
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
                                              roomId: data.activeRoomId,
                                              roomName: data.activeRoomName,
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
                                            roomId: data.activeRoomId,
                                            roomName: data.activeRoomName
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
                                            socket.broadcast.to(data.activeRoomName).emit('sent-file', {
                                                username: data.username,
                                                userColour: data.userColour,
                                                //socketindex: socketIndex,
                                                sender: data.sender,
                                                name: cleanName
                                                });
                                                            
                                                            
                                    var room = Room.build(); 
                                    room.incrementMessageCount(data.activeRoomId);
                                                    
                                    room.retrieveById(data.activeRoomId, function(rooms) {
                                          
                                              if (rooms) {				
                      
                                                  io.to(data.activeRoomName).emit('message-count-updated', {
                                                    roomId: data.activeRoomId,
                                                    messageCount: rooms.messageCount
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
            var activeRoomName = data.activeRoomName;
            var userColour = data.userColour;
            var justFilename = data.name.slice(0, -4);
          
                var stream = Stream.build({
                                      filename: data.name,
                                      state: "live",
                                      genre: data.genre,
                                      upvotes: 0,
                                      streamedByUserId: data.userId,
                                      streamedByUsername: data.username,
                                      roomId: data.activeRoomId,
                                      roomName: data.activeRoomName
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
                                        roomId: data.activeRoomId,
                                        roomName: data.activeRoomName
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

                                    socket.broadcast.to(data.activeRoomName).emit('audio-file-incoming', parameters);
                               
                               } else {
                                
                                    io.to(activeRoomName).emit('audio-file-incoming', parameters);
                                
                               }
                               
                                    var room = Room.build(); 
                                    room.incrementMessageCount(data.activeRoomId);
                                                    
                                    room.retrieveById(data.activeRoomId, function(rooms) {
                                          
                                              if (rooms) {				
                      
                                                  io.to(data.activeRoomName).emit('message-count-updated', {
                                                    roomId: data.activeRoomId,
                                                    messageCount: rooms.messageCount
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

                                    socket.broadcast.to(data.activeRoomName).emit('audio', { buffer: bufferConcat});
                               
                               } else {
                                
                                    io.to(data.activeRoomName).emit('audio', { buffer: bufferConcat});
                                
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
                                                                            
                                               ////console.log(socket.roomIds);
                                               if(typeof socket.roomIds !== "undefined" && typeof socket.roomNames !== "undefined") {
                                                
                                                    updateConnectedClientsInRoom(JSON.stringify(socket.roomIds), JSON.stringify(socket.roomNames));
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
        
