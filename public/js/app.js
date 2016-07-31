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
        

        var uploader = new SocketIOFileUpload(socket);
         document.getElementById("submit-image").addEventListener("click", uploader.prompt, false);
         
        uploader.addEventListener("start", function(event){
            event.file.meta.type = "image";
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
        socket.on("download", function(data) {
            var url = data.url;
            $('#download-iframe').attr('src', data.url);
        });
              
        
                      
        function initiateAudioContext() {
            
            audioContext = window.AudioContext || window.webkitAudioContext;        

            context = new audioContext();
            console.log("init new audio context");
  
            return context;
        }
                
              
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
                 
            ss(socket).emit('file', stream, {size: file.size, name: file.name});
            ss.createBlobReadStream(file).pipe(stream);
            
            localStorage.setItem('stream_state', 'started');
        
        });

   });
    
          
         window.onload = function init() {
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
      
   });
      
      
    /*$('#start-recording').on('click', function(e) {
    
    
        var socket = audioStreamSocketIo(); 
        //window.Stream = client.createStream();
        
              
        //socket.on('connect', function() {
            
        var stream = ss.createStream();
        ss(socket).emit('file', stream, {name: "Audio Recording"});
                     
            if (!navigator.getUserMedia)
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

                if (navigator.getUserMedia) {
         
                    $('#start-recording').hide();
                    $('#stop-recording').show();
    
                
                        navigator.getUserMedia({audio:true}, success, function(e) {
                          alert('Error capturing audio.');
                        });
                      } else alert('getUserMedia not supported in this browser.');
        
              
            var recording = false;
        
            function startRecording() {
                console.log('window start rec');
                recording = true;
                localStorage.setItem('stream_state', 'started');
            }
            
        
           function stopRecording() {
                  recording = false;
                  socket.emit('stop-recording');
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
               volume = context.createGain();
            
               // creates an audio node from the microphone incoming stream
               audioInput = context.createMediaStreamSource(e);
            
               // connect the stream to the gain node
               audioInput.connect(volume);
         
               leftchannel = [];
               rightchannel = [];
               recordingLength = 0;
                     
               startRecording();
       
               var bufferSize = 2048;
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
               
               leftchannel.push (left);
               rightchannel.push (right);
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
               var rightBuffer = mergeBuffers(rightchannel, recordingLength);
               
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

               var interleaved = interleave (leftBuffer, rightBuffer );
            
               console.log(interleaved);
               
               //stream.write(new ss.Buffer(convertoFloat32ToInt16(left)));
               //ss.createBlobReadStream(sixteen_bit_left).pipe(stream);
                
               //window.Stream.write(convertoFloat32ToInt16(left));
             }
       
             volume.connect(recorder)
             recorder.connect(context.destination); 
           }
               
        
            function convertoFloat32ToInt16(buffer) {
              var l = buffer.length;
              var buf = new Int16Array(l)
        
              while (l--) {
                buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
              }
              return buf.buffer
            }
            
                //startTime = 0;                 
          
        //});
            
    });*/
    
    
           $('#web-worker').on('click', function(e) {
                     
    
            
            var decodeAudioWorker = new Worker('web-workers/decodeAudioData.js');
            
            /*decodeAudioWorker.postMessage(data, [data]);
            
            decodeAudioWorker.onmessage = function(e) {
                console.log(e.data);
            }*/
           });
    