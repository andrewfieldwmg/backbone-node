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
    
    }
}