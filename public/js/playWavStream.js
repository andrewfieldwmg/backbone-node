function playPcmStream(socket) {

console.log('PLAY PCM STREAM FUNCTION CALLED');
    
    audioContext = initiateAudioContext();             
    var channels = 2;
    nextTime = 0;
    audioBufferStack = [];
    
    socket.on("pcm-audio", function(streamData) {
            
            
            var data = new DataView(streamData.buffer);
            
            var tempArray = new Int16Array(data.byteLength / Int16Array.BYTES_PER_ELEMENT);
            
            var len = tempArray.length;
            // Incoming data is raw floating point values
            // with little-endian byte ordering.
            for (var jj = 0; jj < len; ++jj) {
              tempArray[jj] = data.getInt16(jj * Int16Array.BYTES_PER_ELEMENT, true);
            }

             
             
             var bufferToPlay = new Float32Array(tempArray.length);

             var channelCounter = 0;
             for (var i = 0; i < tempArray.length;) {
             
                 var normalizedAudio = tempArray[i] / 32768;

                 i = i + 1;
                 bufferToPlay[channelCounter] = normalizedAudio;

                 channelCounter++;
             }


             var audioBuffer = audioContext.createBuffer(1, bufferToPlay.length, 88200);
             audioBuffer.getChannelData(0).set(bufferToPlay);
                          
                audioBufferStack.push(audioBuffer);
                
                console.log(audioBufferStack);
                
                if (audioBufferStack.length >= 1) {
                        playBuffers(audioBufferStack);
                }
                
        });
    
    
                function playBuffers() {
                        
                        while (audioBufferStack.length) {
                                
                                var source = audioContext.createBufferSource();
                                        
                                var audioBuffer = audioBufferStack.shift();
                                
                                source.buffer = audioBuffer;
                             
                                //var gainNode = audioContext.createGain();
                                source.connect(audioContext.destination);
                                //gainNode.connect(audioContext.destination);
                                //gainNode.gain.value = 1;
                                
                                if (nextTime == 0)
                                nextTime = audioContext.currentTime + 0.05;  /// add 50ms latency to work well across systems - tune this if you like
                                
                                source.start(nextTime);
                                nextTime += source.buffer.duration;
                                
                                console.log('next time: ' + nextTime);
                                console.log('context current time: ' + audioContext.currentTime);
                
                        }
                }
                
                             
        $(document).on('click', '.mejs-pause', function(e) {
                
                e.stopPropagation();
                console.log('pause clicked');
                audioContext.suspend();
              
             $('.mejs-playpause-button').removeClass('mejs-pause').addClass('mejs-play');
             
          });
        
        
          $(document).on('click', '.mejs-play', function(e) {
                
                e.stopPropagation();
                console.log('play clicked');
                audioContext.resume();
              
             $('.mejs-playpause-button').removeClass('mejs-play').addClass('mejs-pause');
              
          });
                                   
                        
                $('#stop').on('click', function(e) {
              
                    console.log('stop clicked');
                    
                  e.stopPropagation();
              
                   socket.emit('stop-audio-stream');
                   
                   //$('#message-results').append('<li class="list-group-item">Outbound stream stopped</li>')
                     
                   localStorage.setItem('streamState', 'stopped');
                                                 
                      audioContext.close().then(function() {
                        
                            //playMp3Stream(socket);
                          console.log('close promise resolved');
        
                      });
           
                });
         
                
    return socket;

}

