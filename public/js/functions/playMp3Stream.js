function playMp3Stream(socket, currentStreamTime) {
       
    console.log("PLAY MP3 FUNCTION CALLED");
    
    localStorage.setItem("playMp3FunctionLoaded", "true");
      
      //socket.on('connect', function() {

        audioContext = initiateAudioContext();
        
        var audioContextLoadedTime = new Date();
                
        var init = 0;
        var audioStack = [];
        var nextTime = 0;
        var i = 0;
        
        if (currentStreamTime > 0) {
          var offset = currentStreamTime;
        } else {
          var offset = 0;
        }
       
       console.log('offset: ' + offset);
        //console.log('current stream start time: ' + currentStreamTime);
          
   
         /*function createCanvas ( w, h ) {
             var newCanvas = document.createElement('canvas');
             newCanvas.width  = w;     newCanvas.height = h;
             return newCanvas;
         };
                                  
         var canvasWidth = 512, canvasHeight = 120 ;
         var newCanvas = createCanvas (canvasWidth, canvasHeight);
         var context = null;
         
         document.body.appendChild(newCanvas);
         context = newCanvas.getContext('2d');*/
           
          socket.on("audio", function(data) {
 
          console.log('receiving audio stream via socket io stream');  
            
            if(localStorage.getItem("streamState") === "stopped") {
                        
                return;
            
            } else {
                
                var gainNode = audioContext.createGain();
                                          
                if(localStorage.getItem("streamVolume")) {
                    var volumeToUse = localStorage.getItem("streamVolume");
                } else {
                    var volumeToUse = 1;
                }
                
                gainNode.gain.value = volumeToUse;
                                
                    socket.on('set-volume', function (data) {
                        console.log(data.newVolume);
                        gainNode.gain.value = data.newVolume;
                });
                
            
                audioContext.decodeAudioData(data.buffer, function(buffer) {

                  audioStack.push(buffer);
                  
                  if ((init != 0) || (audioStack.length >= 2)) { // make sure we put at least 10 chunks in the buffer before starting
                      init++;
                      scheduleBuffers(gainNode);
                     
                  }
                    
                     /*                
                     //renderWaveform(buff);
                                        
                     // MUSIC DISPLAY
                     /*function renderWaveform(buff) {
                        
                        var leftChannel = buff.getChannelData(0); // Float32Array describing left channel     
                        var lineOpacity = canvasWidth / leftChannel.length ;      
                        context.save();
                        context.fillStyle = '#222';
                        context.fillRect(0, 0, canvasWidth,canvasHeight);
                        context.strokeStyle = '#121';
                        context.globalCompositeOperation = 'lighter';
                        context.translate(0, canvasHeight / 2);
                        context.globalAlpha = 0.06 ; // lineOpacity ;
                        
                        for (var i = 0; i < leftChannel.length; i++) {
                            // on which line do we get ?
                            var x = Math.floor (canvasWidth * i / leftChannel.length) ;
                            var y = leftChannel[i] * canvasHeight / 2 ;
                            context.beginPath();
                            context.moveTo(x , 0);
                            context.lineTo(x+1, y);
                            context.stroke();
                        }
                        
                        context.restore();
                        console.log('done');
                        
                     }*/

              
                      }, function (error) {
                          console.error("failed to decode:", error);
                      });
              
          
                  //$('#pause').show();  
                 
                }  
               
              
            });
              

            function scheduleBuffers(gainNode) {
             
                   while (audioStack.length) {
                        
                    console.log('schedule buffers');
                    
                      var source = audioContext.createBufferSource();
                               
                       var buffer = audioStack.shift();
                       
                       source.buffer = buffer;
                             
                       source.connect(gainNode);
                       
                       gainNode.connect(audioContext.destination);
              
                       if (nextTime == 0)
                           nextTime = audioContext.currentTime + 0.05;  /// add 50ms latency to work well across systems - tune this if you like
                           
                        source.start(nextTime, offset);
                         
                        var sourceStartTime = new Date();
                                                                       
                        var playTimeOffset = (sourceStartTime - audioContextLoadedTime) / 1000;
                            
                             if (i === 0) {
                                
                                    if(localStorage.getItem("userRole") === "streamer") {
                                        
                                          window.timerInterval = setInterval(function(){
                                          
                                              var currentStreamTime = Math.round(audioContext.currentTime - playTimeOffset);
                                              
                                              console.log('audiocontext real time: ' + currentStreamTime);
                                              
                                              socket.emit("update-current-play-time", {channelId: localStorage.getItem("activeChannelId"), currentStreamTime: currentStreamTime });
                                          
                                          }, 1000);
                          
                                   } else {
                                      
                                           if (typeof window.timerInterval != "undefined") {
                                              clearInterval(window.timerInterval);
                                            }
                                      
                                   }
                             
                            }
                             
                                     
                             if((audioContext.state == "running") && (i >= 2)) {
                                 $('.audioplayer-loading-spinner').hide();
                             }
     
     
                         nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
                          
                         i++;
     
                   
                   };
                       //audioStack = [];
                       
                }    
                           
                           
                $(document).on('click', '.player-play-button', function(e) {
                  
                    e.stopPropagation();
                    console.log('play clicked');
                    audioContext.resume();
                    
                    $('.player-play-button').hide();
                    $('.player-pause-button').show();
                    
                });
      
      
                $(document).on('click', '.player-pause-button', function(e) {
                
                    e.stopPropagation();
                    console.log('pause clicked');
                    audioContext.suspend();
                    
                    $('.player-play-button').show();
                   $('.player-pause-button').hide();
                   
                });
              
                               
                $('#stop-all-audio').on('click', function(e) {
                
                    console.log('stop clicked');
                      
                    e.stopPropagation();
                
                    if (typeof window.timerInterval != "undefined") {
                        clearInterval(window.timerInterval);
                    }             
                
                    socket.emit('stop-audio-stream', {
                        userRole: localStorage.getItem("userRole"),
                        activeChannelId: localStorage.getItem("activeChannelId")
                    });
                     
                      //$('.stop-featured-stream').trigger('click');
                      
                     //$('#message-results').append('<li class="list-group-item">Outbound stream stopped</li>')
                       
                    localStorage.setItem('streamState', 'stopped');
                                         
                                               
                    if(typeof audioContext != "undefined" && audioContext.state != "closed") {
                        
                            audioContext.close().then(function() {
         
                                console.log('close promise resolved');
                                
                                var audioPlayer = new AudioPlayerView({streamName : "" });
                                audioPlayer.destroy();
    
                            });
                    
                    }
       
             
                });
            

          //});
      
        /*return {
          "socket":socket,
          "audioContext":audioContext
         }*/
        
        
       return audioContext;  
      //return socket;    
  }