module.exports = {
                    
        processNewMessage: function(io, socket, data, Message, Channel) {
       
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
                                    channelName: data.activeChannelName,
                                    messageType: "message"
                                    });
              
              message.add(function(success) {
                           
                   //socket.broadcast.emit('message', { message: message, sender: sender });
                    io.to(activeChannelId).emit('message', {
                        channelId: data.activeChannelId,
                        message: data.message,
                        username: username,
                        userId: userId,
                        userColour: userColour,
                        messageType: "message"
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
              
    
        },
        
        
        getMessageHistory: function(io, socket, Message, channelId) {
                                                                    
                                            
                var message = Message.build();

                 message.findAllWhere(channelId, null, function(messages) {
                     
                     if (messages.length > 0) {
                                
                            socket.emit('emptyMessages');
                                
                            //for(i = 0; i < messages.length; i++) {
                                
                                //console.log('emitting mess ' + messages[i].message);
                                
                                socket.emit('message-history', {
                                    channelId: channelId,
                                    messages: JSON.stringify(messages)
                                });
                                
                                
                           //}
                            
                                       
                    } else {
                       
                          socket.emit('message-history', {
                                 channelId: channelId,
                                   messages: null
                           });
                          
                    }
                    
              }, function(error) {
                    //res.send("User not found");
              });
                 
        }
        
        
}