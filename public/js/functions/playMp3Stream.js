function playMp3Stream(socket) {
       
    console.log("PLAY MP3 FUNCTION CALLED");
        
       // HERE WE DO THE FILE UPLOAD / STREAM WITH SS
       
      //socket.on('connect', function() {

          audioContext = initiateAudioContext();
                               
          var init = 0;
          var audioStack = [];
          var nextTime = 0;
   
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
                    
                    
               //console.log(data.buffer);
            
              audioContext.decodeAudioData(data.buffer, function(buffer) {

          
                  //bufDuration += buffer.duration;
              
                  //console.log(buffer);
                  
                  //$('.mejs-time-current').css('width', bufDuration);
                      
                  audioStack.push(buffer);
                  
                  if ((init!=0) || (audioStack.length >= 2)) { // make sure we put at least 10 chunks in the buffer before starting
                      init++;
                       //console.log('audiostack length at start: ' + audioStack.length);
                       scheduleBuffers(gainNode);
                     
                  }
                    
                     /*var source = audioContext.createBufferSource();
                   
                      console.log(buff.duration);
                   
                     source.buffer = buff;
                     source.connect(audioContext.destination);
                     
                     source.start();

                     startTime += buff.duration;*/
                                         
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
              
       
          i = 0;
           function scheduleBuffers(gainNode) {
            
            console.log('schedule buffer');
         
              while (audioStack.length) {
                
                i++;
                
                //console.log(i);
                 var source = audioContext.createBufferSource();
                          
                
                  var buffer = audioStack.shift();
                  
                  source.buffer = buffer;
                        
                  source.connect(gainNode); 
                  gainNode.connect(audioContext.destination);
                 
                  
                  if (nextTime == 0)
                      nextTime = audioContext.currentTime + 0.05;  /// add 50ms latency to work well across systems - tune this if you like
                      
                  //$('.mejs-time-handle').css('margin-left', nextTime / 100);
                  source.start(nextTime);
                  
                  if((audioContext.state == "running") && (i >= 2)) {
                    
                      $('.fa-refresh').hide();
                      
                  }
                  
                  //$('.mejs-time-handle').css('margin-left', nextTime);
                  nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
  
              
              };
                  //audioStack = [];
                  //console.log('audiostack length at end: ' + audioStack.length);
                  
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
            

          //});
      
        /*return {
          "socket":socket,
          "audioContext":audioContext
         }*/
        
       return audioContext;  
      //return socket;    
  }