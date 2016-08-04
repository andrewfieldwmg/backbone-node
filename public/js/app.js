var tabID = sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random()

             
        var socket = io.connect();
                              
        //socket.on('connect', function() {       
        //    console.log("Socket IO connected");
        //});
        
        
        socket.on('disconnect', function(){
           console.log('SocketIO connection to the server terminated');
                 
        });
        
        //SENDING
        
        $('#submit-message').on('click', function(e) {
            
            console.log('submit message');
            e.preventDefault();
            var message = $('#message-text').val();                   
            socket.emit('message', { sender: tabID, message: message });
            $('#message-text').val("");
        });
        

        
              
               
     $('#send-file').click(function(){
        $('#file').click();
     });
     
     
    $('#file').change(function(e) {
    
            var socket = io.connect();          
            var file = e.target.files[0];
             
            var stream = ss.createStream();
                 
            ss(socket).emit('file-upload', stream, {size: file.size, name: file.name, type: file.type});
            ss.createBlobReadStream(file).pipe(stream);

      });
    
                    
        //RECEIVING
        
        socket.on('message', function (data) {
           $('#message-results').append('<li class="list-group-item">Message from ' + data.sender + ': <strong>' + data.message + '</strong></li>')
        });
        
        
        socket.on("image", function(data) {
            var src = data.src;
            $('#image-results').append('<img class="img-fluid" src="' + src + '" style="padding: 10px">');
        });
    
    
        //NOT USED YET
        socket.on("sent-file", function(data) {
         console.log("receiving sent file");
         
            var savedName = data.name;
            
            $('#download-iframe').attr('src', '/api/download?file=' + savedName);
        });
              
        
        
        /////AUDIO/////
 

         function convertoFloat32ToInt16(buffer) {
           var l = buffer.length;
           var buf = new Int16Array(l)
     
           while (l--) {
             buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
           }
           return buf.buffer
         }
         
        function initiateAudioContext() {
            
            audioContext = window.AudioContext || window.webkitAudioContext;        

            context = new audioContext();
            console.log("init new audio context");
  
            return context;
        }
                
                
                
         /*function audioStream() {
                
            var socket = io.connect();
                                
             // HERE WE DO THE FILE UPLOAD / STREAM WITH SS   
            socket.on('connect', function() {
                
              console.log('SocketIO connection to the server established');
                                        
               context = initiateAudioContext();
                
                // THIS BIT DOES NOW WORK, BUT ONLY TO ONE SOCKET!!       
               startTime = 0;
               ss(socket).on('audio', function(stream, data) {
                
                console.log('receiving audio stream via socket io stream');  
                             
                    stream.on('data', function(audio_buffer) {
                              
                        console.log(audio_buffer);
                        
                    //localStorage.setItem('stream_state', 'started');
                    
                        console.log('receiving data from audio stream...');
                         
                        var arrayBuffer = audio_buffer.toArrayBuffer();
                           
                        context.decodeAudioData(arrayBuffer, function(buffer) {
                       
                        if(localStorage.getItem("stream_state") === "stopped") {
                            
                            //context.suspend();
                                          
                            //var source = context.createBufferSource();
                            //console.log('stream state stopped in storage');
            
                            //source.buffer = context.createBuffer(2, 1, 44100);
                            //return false;
                            //source.stop();
                            //source.disconnect();                        
                      
                        } else {
                            
                                console.log('stream state started in storage');
                                              
                                var source = context.createBufferSource();
                                source.buffer = buffer;
                                 
                                source.disconnect();
                                source.connect(context.destination);
                                source.start(startTime);
        
                                startTime += buffer.duration;                    
                      
                        }
                
       
                           }, function (error) {
                                   console.error("failed to decode:", error);
                               });
               
                
                
                    });
               
                
                           $('#pause').on('click', function(e) {                
                                context.suspend();
                            });
                          
                            $('#resume').on('click', function(e) {                
                                context.resume();
                            });
                            
                                       
                        stream.on('end', function() {
                            
                            console.log('Audio stream ended');
                });
        
              
            });
        
               
        
        });
            
        return socket;    
    }*/
    
          
          
        function audioStreamSocketIo() {
                
            var socket = io.connect();
                                
             // HERE WE DO THE FILE UPLOAD / STREAM WITH SS   
            socket.on('connect', function() {
                
              console.log('SocketIO connection to the server established');
         
                // THIS BIT DOES NOW WORK, BUT ONLY TO ONE SOCKET!!       
 
                context = initiateAudioContext();

                startTime = 0;   
                socket.on("audio", function(data) {
       
                //console.log('receiving audio stream via socket io stream');  
                if(localStorage.getItem("stream_state") === "stopped") {
                            
                    return;
                
                } else {
                       
                     //console.log(data.buffer);
                  
                    context.decodeAudioData(data.buffer, function(buffer) {
         
                     
                            var source = context.createBufferSource();
                          
                            source.buffer = buffer;
                            source.connect(context.destination);
                            
                            source.start(startTime);
    
                            startTime += buffer.duration;
                   
                
                            }, function (error) {
                                console.error("failed to decode:", error);
                            });
                
                        $('#pause').show();
                 }
                 
                          $('#pause').on('click', function(e) {                
                                context.suspend();
                                
                                $('#pause').hide();
                                $('#resume').show();
                            });
                          
                            $('#resume').on('click', function(e) {                
                                context.resume();
                                
                                $('#resume').hide();
                                $('#pause').show();
                                
                            });
                  
                           
                    });
                                                    
                            
                    $('#stop').on('click', function(e) {
                      
                          e.stopPropagation();
                          
                           socket.emit('stop-audio-stream');                       
                             
                           localStorage.setItem('stream_state', 'stopped');
                                                         
                              context.close().then(function() {
                                
                                  console.log('close promise resolved');

                              });
                   
                    });
                  
      
                });
            
            
            return socket;    
        }
        
               
    $('#listen').on('click', function(e) {
        
        $.when(
               $('#stop').triggerHandler('click') /* asynchronous task */
        ).done(function() {
                    audioStreamSocketIo(); 
        });
            
     });        
         

     
     var theWavDataInFloat32;

   /*function floatTo16Bit(inputArray, startIndex){
       var output = new Uint16Array(inputArray.length-startIndex);
       for (var i = 0; i < inputArray.length; i++){
           var s = Math.max(-1, Math.min(1, inputArray[i]));
           output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
       }
       return output;
   }
   
   // This is passed in an unsigned 16-bit integer array. It is converted to a 32-bit float array.
   // The first startIndex items are skipped, and only 'length' number of items is converted.
   function int16ToFloat32(inputArray, startIndex, length) {
       var output = new Float32Array(inputArray.length-startIndex);
       for (var i = startIndex; i < length; i++) {
           var int = inputArray[i];
           // If the high bit is on, then it is a negative number, and actually counts backwards.
           var float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
           output[i] = float;
       }
       return output;
   }*/

              
               
     $('#start-file-stream').click(function(){
        $('#audio-file').click();
     });
     
     
    $('#audio-file').change(function(e) {
    
        $.when(
               $('#stop').triggerHandler('click') /* asynchronous task */
        ).done(function() {
   
    
            socket = audioStreamSocketIo();           
            var file = e.target.files[0];
       
            
            var stream = ss.createStream();
                 
            ss(socket).emit('audio-file', stream, {size: file.size, name: file.name, type: file.type});
            ss.createBlobReadStream(file).pipe(stream);

            localStorage.setItem('stream_state', 'started');
        
        });

   });
    
    
   $('#play').on('click', function(e) {
 
        $.when(
               $('#stop').triggerHandler('click') /* asynchronous task */
        ).done(function() {
    
            socket = audioStreamSocketIo();           
            socket.emit('play-audio');
                
            localStorage.setItem('stream_state', 'started');
        
        });

   });
          
         /*window.onload = function init() {
          try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            
            audio_context = new AudioContext;
            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
          } catch (e) {
            console.log(e);
            alert('No web audio support in this browser!');
          }
          
          navigator.getUserMedia(
                        {
                           "audio": {
                       "mandatory": {
                           "googEchoCancellation": "false",
                           "googAutoGainControl": "false",
                           "googNoiseSuppression": "false",
                           "googHighpassFilter": "false"
                       },
                       "optional": []
                   },
                  },
                     startUserMedia, function(e) {
            console.log('No live audio input: ' + e);
          });
   
              
        };
        
        
         var audio_context;
         var recorder;
         
         function startUserMedia(stream) {
           var input = audio_context.createMediaStreamSource(stream);
           console.log('Media stream created.');
           // Uncomment if you want the audio to feedback directly
           //input.connect(audio_context.destination);
           //console.log('Input connected to audio context destination.');
           
           recorder = new Recorder(input);
           console.log('Recorder initialised.');
         }
         
         function startRecording() {
            
           recorder && recorder.record();
           recorder && recorder.getBuffer(function(buffer) {
               console.log(buffer);
           });
           
           console.log('Recording...');
         }
         
         function stopRecording() {
           recorder && recorder.stop();
           console.log('Stopped recording.');
           
           // create WAV download link using audio data blob
           createDownloadLink();
           
           recorder.clear();
         }
         
         function createDownloadLink() {
           recorder && recorder.exportWAV(function(blob) {
             var url = URL.createObjectURL(blob);
             var li = document.createElement('li');
             var au = document.createElement('audio');
             var hf = document.createElement('a');
             
             au.controls = true;
             au.src = url;
             hf.href = url;
             hf.download = new Date().toISOString() + '.wav';
             hf.innerHTML = hf.download;
             li.appendChild(au);
             li.appendChild(hf);
             recordingslist.appendChild(li);
           });
         }
         
         
    $('#start-recording').on('click', function(e) {
         startRecording();
    
    });
    
    
   $('#stop-recording').on('click', function(e) { 
      stopRecording();
      
   });*/
      
      
    $('#start-recording').on('click', function(e) {
    
    
        var socket = audioStreamSocketIo(); 
        //window.Stream = client.createStream();
     
        socket.on('connect', function() {
            
        var stream = ss.createStream();
        
        ss(socket).emit('audio-recording', stream, {name: "Audio Recording"});
                     
            if (!navigator.getUserMedia)
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

                if (navigator.getUserMedia) {
         
                    $('#start-recording').hide();
                    $('#stop-recording').show();
    
                
                      navigator.getUserMedia(
                        {
                           "audio": {
                           "mandatory": {
                               "googEchoCancellation": "false",
                               "googAutoGainControl": "false",
                               "googNoiseSuppression": "false",
                               "googHighpassFilter": "false"
                       },
                       "optional": []
                   },
                  },
                              success, function(e) {
                     console.log('No live audio input: ' + e);
                   });
                      
                      } else alert('getUserMedia not supported in this browser.');
        
              
            var recording = false;
        
            function startRecording() {
                console.log('window start rec');
                recording = true;
                localStorage.setItem('stream_state', 'started');
               
                $('#start-recording').hide();
                $('#stop-recording').show();
            }
            
        
           function stopRecording() {
                  recording = false;
                  stream.end();
                  localStorage.setItem('stream_state', 'stopped');
            }
                
                          
            $('#stop-recording').on('click', function(e) {
                
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Recording stopped');

                stopRecording();
                
                $('#start-recording').show();
                $('#stop-recording').hide();
 
            });
            

        
           function success(e) {
            
             audioContext = window.AudioContext || window.webkitAudioContext;
             context = new audioContext();
             
               sampleRate = context.sampleRate;
             
               // creates a gain node
               //volume = context.createGain();
            
               // creates an audio node from the microphone incoming stream
               audioInput = context.createMediaStreamSource(e);
            
               // connect the stream to the gain node
               //audioInput.connect(volume);
         
               //leftchannel = [];
               //rightchannel = [];
               recordingLength = 0;
                     
               startRecording();
       
               var bufferSize = 4096;
               recorder = context.createScriptProcessor(bufferSize, 2, 2);
         
               recorder.onaudioprocess = function(e){
               if(!recording)  {
                return;
               }
   
               //console.log ('recording');
               var left = e.inputBuffer.getChannelData(0);
               var right = e.inputBuffer.getChannelData(1);
        
               //var sixteen_bit_left = convertoFloat32ToInt16(left);
               //var sixteen_bit_right = convertoFloat32ToInt16(right);
               
               /*leftchannel.push (new Float32Array(left));
               rightchannel.push (new Float32Array(right));
               recordingLength += bufferSize;
               

               function mergeBuffers(channelBuffer, recordingLength){
                 var result = new Float32Array(recordingLength);
                 var offset = 0;
                 var lng = channelBuffer.length;
                 for (var i = 0; i < lng; i++){
                   var buffer = channelBuffer[i];
                   result.set(buffer, offset);
                   offset += buffer.length;
                 }
                 return result;
               }
               
               var leftBuffer = mergeBuffers(leftchannel, recordingLength);
               var rightBuffer = mergeBuffers(rightchannel, recordingLength);*/
               
               function interleave(leftChannel, rightChannel){
                  var length = leftChannel.length + rightChannel.length;
                  var result = new Float32Array(length);
                 
                  var inputIndex = 0;
                 
                  for (var index = 0; index < length; ){
                    result[index++] = leftChannel[inputIndex];
                    result[index++] = rightChannel[inputIndex];
                    inputIndex++;
                  }
                  return result;
                }

               var interleaved = interleave (left, right );
             
               stream.write(new ss.Buffer(convertoFloat32ToInt16(interleaved)));
            

             }
       
             audioInput.connect(recorder)
             recorder.connect(context.destination); 
           }
               

            
                //startTime = 0;                 
          
        });
            
    });
    
