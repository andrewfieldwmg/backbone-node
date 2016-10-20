module.exports = {
    
    updateStreamsForUser: function(io, socket, Stream) {
         
            var stream = Stream.build();

             stream.retrieveAll(function(streams) {
                 
                 if (streams.length > 0) {
                            
                        //socket.emit('emptyMessages');
                         
                            //console.log('emitting mess ' + messages[i].message);
                            socket.emit('available-streams', {
                                availableStreams: JSON.stringify(streams)
                            });
                                                                           
                        
                 } else {
                    
                        socket.emit('available-streams', {
                            availableStreams: null
                        });
                 }
                 
           }, function(error) {
                 //res.send("User not found");
           });
                 
    },
    
    getStreamInfo: function(req, res, Stream) {
        
            var requestedStreamId = req.query.streamId;
        
                var stream = Stream.build();
                stream.retrieveById(requestedStreamId, function(streamModel) {
               
                       if (streamModel) {
                                        
                          res.send(JSON.stringify(streamModel));
                          
                       } else {
        
                       }
                 }, function(error) {
                    
                });
    
    },
    
    updateAvailableStreams: function(io, socket, Stream) {
           
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
    
    updateStreamOnEnd: function(io, socket, streamId, Stream, Channel) {

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
             
             
    }
    
                   
}