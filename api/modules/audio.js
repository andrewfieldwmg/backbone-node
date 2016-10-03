module.exports = {
        
        setVolume: function(io, socket, data) {
            
             socket.emit('set-volume', { newVolume: data.newVolume});
             
        },
        
        listenToFeaturedStream: function(io, socket, data, Stream, Writable, fs, config) {
            
            var requestedStreamId = data.requestedStreamId;
            
                var stream = Stream.build();
                
                stream.retrieveById(requestedStreamId, function(streams) {
                    
                        if (streams) {				
                                
                                var buffer = [];
                         
                                const socketSendWritableOffline = new Writable({
                                    
                                  write(chunk, encoding, callback) {
                                    
                                    buffer.push(chunk);
                        
                                    if(buffer.length >= 10) {
                                        
                                        var bufferConcat = Buffer.concat(buffer);
                                        
                                                socket.emit('audio', { buffer: bufferConcat});
                                                  
                                       buffer = [];
                                    }
                                
                                    callback();
                                  }
                                
                            });
                                      
                                        
                                var parameters = {
                                           userColour: "",
                                           audioType: "audio/mp3",
                                           username: streams.streamedByUsername,
                                           name: streams.filename
                                           };

                                
                                var offlineFile = fs.createReadStream(config.filePaths.audioPath + "/" + requestedStreamId + ".mp3");
                                       
                                offlineFile.pipe(socketSendWritableOffline);
            
            
                        } else {
                        
                        }
                        
                        
                  }, function(error) {
                      
                  });
    
        },
        
        stopFeaturedAudioStream: function(io, socket) {
            
            socket.emit('stop-featured-audio-stream');
                        
        },
        
        processIncomingAudioStream: function(io, socket, data, inboundStream, Writable, Stream, Message, Channel, fs, config, SoxCommand, proc) {
             
            var self = this;
            
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
                                        userId: data.userId,
                                        username: data.username,
                                        sender: data.sender,
                                        name: justFilename
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
                                                
                                                        channel.currentStreamId = streamId;
                                                        channel.currentStreamName = justFilename;
                                                        channel.currentStreamStatus = "started";
                                                         
                                                        channel.updateStreamById(data.activeChannelId, function(success) {
                                                            
                                                                if (success) {	
                                                                        
                                                                } else {
                                                                 
                                                                }
                                                          }, function(error) {
                                                                
                                                          });
                      
                      
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
       
       
                    self.startOutboundStream(io, socket, data, inboundStream, streamId, Writable, Stream, Channel, fs, config, SoxCommand, proc);
                    
              },
              
              function(err) {
                  ////console.log("New message NOT written to database");
              });

   
            return inboundStream;
        
        
        },
        
        
        startOutboundStream: function(io, socket, data, inboundStream, streamId, Writable, Stream, Channel, fs, config, SoxCommand, proc) {
 
            var mimeType = data.type;          
            var offlineFile = fs.createWriteStream(config.filePaths.audioPath + "/" + streamId + ".mp3");
                
                var buffer = [];
         
                const socketSendWritableMp3 = new Writable({
                    
                  write(chunk, encoding, callback) {
                    
                    buffer.push(chunk);
                    
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
            /*const Transform = require('stream').Transform;
              
            const transformWav = new Transform({
              write(chunk, encoding, callback) {
             
                this.push(new Buffer(chunk, 'binary'));
            
                callback();
              }
            });*/
            

              if (mimeType === 'audio/wav/stream') {
                
                ////console.log('audio/wav/stream');
           
                    var command = SoxCommand();
                    
                    command.input(inboundStream)
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
                    
                    command.input(inboundStream)
                        .inputFileType('wav')
                        .output(socketSendWritableMp3)
                        .outputBits(16)
                        .outputFileType('mp3')
                        .outputSampleRate('44.1k')
                        .outputBitRate('128');
                     
                    command.run();
                  
                } else if (mimeType === 'audio/mp3') {
                    
                    /*var command = SoxCommand();
                    
                    command.input(inboundStream)
                        .inputFileType('mp3')
                        .output(socketSendWritableMp3)
                        .outputBits(16)
                        .outputFileType('mp3')
                        .outputSampleRate('44.1k')
                        .outputBitRate('128');
                        
                    command.run();*/
                    
                    inboundStream.pipe(socketSendWritableMp3);
                  
                }
                
                
                        ////console.log('sending stream to client(s): '  + data.name);
                   
               socket.on('stop-audio-stream', function (data) {
                   
                   proc.kill('SIGINT');
        
                   ////console.log('Stopping stream from stop message INSIDE stream');  
  
                   inboundStream.read(0);
                   inboundStream.push(null);
                   inboundStream.end();
                   inboundStream.destroy();
                   
                   //offlineFile.end();

                   buffer = [];
                   
                   var stream = Stream.build();	
             
                       stream.state = "offline";
                       
                       stream.updateStateById(streamId, function(success) {
                 
                           if (success) {

                                    var channel = Channel.build(); 
                  
                                    channel.currentStreamStatus = "stopped";
                                     
                                    channel.updateStreamStatusByStreamId(streamId, function(success) {
                                        
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
                   
                   //socket.disconnect();

               });

                  
               inboundStream.on('end', function() {
                       ////console.log('Inbound audio stream ended: ' + data.name);
                                             
                       /*var stream = Stream.build();	
             
                       stream.state = "offline";
                       
                       stream.updateStateById(streamId, function(success) {
                 
                           if (success) {
      
                                     stream.retrieveAll(function(streams) {
                                           
                                           if (streams) {
                                                      
                                                  //socket.emit('emptyMessages');
  
                                                      //console.log('emitting mess ' + messages[i].message);
                                                
                                                                                                                                                   
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
                       
                     }); */
                       
                       
                   
               });
               
          
            
            
        },
        
        
        stopAudioStream: function(io, socket, data) {
                
                if (data.userRole == "streamer") {
                        console.log("streamer stop = "+ data.activeChannelId);
                        io.to(data.activeChannelId).emit('stop-audio-stream');
                } else {
                        console.log('listener stop');
                        socket.emit('stop-audio-stream');
                }
          
        }
        
        
        
        
}