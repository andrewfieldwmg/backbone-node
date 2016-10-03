module.exports = {
    
    serveDownload: function(req, res, config, fs, path, mime) {
                
        var requestedFile = decodeURIComponent(req.query.file);
       
        var file = config.filePaths.uploadDir + "/" + requestedFile;
    
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
    
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
    
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
        
    },
    
    processFileTransfer: function(io, socket, data, fileStream, File, Message, Channel, config, fs, sanitise) {
                        
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
        
        
    }
}