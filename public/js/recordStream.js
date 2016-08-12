   
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
               
               
                  
    //$('#start-recording').on('click', function(e) {
    
    function startLiveStream(socket) {
        
    console.log('start recording function activated');
    
        //var socket = audioStreamSocketIo(); 
        //window.Stream = client.createStream();
     
        //socket.on('connect', function() {
            
        var stream = ss.createStream();
        
        ss(socket).emit('audio-file', stream, {username: localStorage.getItem("username"), sender: tabID, name: "Live Stream", type: "audio/wav"});
                     
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
                localStorage.setItem('streamState', 'started');
               
                $('#start-recording').hide();
                $('#stop-recording').show();
            }
            
        
           function stopRecording() {
                  recording = false;
                  stream.end();
                  localStorage.setItem('streamState', 'stopped');
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
               

    }       
                //startTime = 0;                 
          
        //});
        
            
    //});
    