    // Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
    // Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

if (!isChrome && !isFirefox) {
    //alert('Sorry, this application only works with the latest versions of Google Chrome.');
    $('body').addClass('disabled');
    $('#message-results').append('<li class="list-group-item"><strong>Sorry, this application only works with the latest versions of Google Chrome.</strong></li>')
}

var tabID = sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random()

var time = new Date(new Date().getTime()).toLocaleTimeString();
            
        var playSound = (function beep() {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
            return function() {     
                snd.play(); 
            }
        })();
            
        function initSocketIo() {
            var socket = io.connect();
            return socket;
        }
        
        function scrollToBottom() {
            $('.scrollable').scrollTop($('.scrollable')[0].scrollHeight);
        }
        
        function getSocketCss(socketIndex) {
            
            if (socketIndex === 0) {
                var liClass = "list-group-item-success";
            } else if (socketIndex === 1) {
                var liClass = "list-group-item-warning";
            }
            
            return liClass;
        }
        
        window.onload = function() {
         //initSocketIo();
        };

   
        socket = initSocketIo();
        
                
        socket.on('connect', function() {       
            console.log("Socket IO connected");
        });
        
        socket.on('socket-info', function(data) {
            var socketIndex = data.socketindex;
            
            localStorage.setItem('socketindex', socketIndex);
     
        });
        
        socket.on('disconnect', function(){
           console.log('SocketIO connection to the server terminated');    
        });
        
        //SENDING
        
        function usernameIsSet() {
            
                $('#message-text').attr('placeholder', 'What do you want to say, ' + localStorage.getItem("username") + '?');
                $('.application-body').show();
                $('#username-form').hide();
        }
        
        
        $(document).on('ready', function() {
            
            if(localStorage.getItem("username")) {
                    usernameIsSet();
            
            }
        });
        
        
        $('#submit-username').on('click', function(e) {
            
            console.log('submit username');
            e.preventDefault();
            var username = $('#username').val();
            
            socket.emit('username', { sender: tabID, username: username });
            
            localStorage.setItem('username', username);
            
            usernameIsSet();
        });
             
             
        $('#submit-message').on('click', function(e) {
            
            console.log('submit message');
            e.preventDefault();
            var message = $('#message-text').val();
            
            socket.emit('message', { sender: tabID, username: localStorage.getItem("username"), message: message });
            
            $('#message-text').val("");
        });
        
          
         $('#send-file').click(function(){
            $('#file').click();
         });
         
     
         $('#file').change(function(e) {
         
                 //var socket = io.connect();          
                 var file = e.target.files[0];
                  
                 var stream = ss.createStream();
                      
                 ss(socket).emit('file-upload', stream, { username: localStorage.getItem("username"), sender: tabID, username: localStorage.getItem("username"), size: file.size, name: file.name, type: file.type});
                 ss.createBlobReadStream(file).pipe(stream);
                 
                 $('#message-results').append('<li class="list-group-item list-group-item-info"><strong>' + time + '</strong> Sending file: <strong>' + file.name + '</strong></li>')
     
           });
    
                    
                    
        //RECEIVING
        
        socket.on('message', function (data) {

            var socketIndex = data.socketindex;
            var socketCss = getSocketCss(socketIndex);
    
           $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> Message from ' + data.username + ': <strong>' + data.message + '</strong></li>')
            
            scrollToBottom();
            playSound();
        });
           
         
         socket.on("stop-audio-stream", function(data) {
            
            console.log('socket received from server: stop audio stream');
            
             if(localStorage.getItem("stream_state") !== "stopped") {
                
                $('#stop').trigger('click');
                    console.log('stream state started, so triggered stop button');
             } else {
                    console.log('stream state already stopped, so didnt trigger stop button');
             }
             
            /*localStorage.setItem('stream_state', 'stopped');
                                          
               audioContext.close().then(function() {
                 
                   console.log('close promise resolved');
                   $('#message-results').append('<li class="list-group-item">Inbound stream stopped</li>')

               });*/
            
         });
    
    
    
        socket.on("audio-file-incoming", function(data) {
            
            var socketIndex = data.socketindex;
            var socketCss = getSocketCss(socketIndex);
            
            audioStreamSocketIo(socket);
            
            //$('#listen').trigger('click');
        
                $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> Inbound stream loading from ' + data.username + ': <strong>' + data.name + '</strong></li>')
                    
                localStorage.setItem('stream_state', 'started');
                
                scrollToBottom();
                playSound();
            
         });
        
        
        socket.on("sent-file-incoming", function(data) {
            
            var socketIndex = data.socketindex;
            var socketCss = getSocketCss(socketIndex);
            
            $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> File transfer incoming from ' + data.username + ': <strong>' + data.name + '</strong> (loading...)</li>')
    
            scrollToBottom();
            playSound();
            
         });
    
    
 
        socket.on("sent-file", function(data) {
            
         console.log("receiving sent file");
         
           var socketIndex = data.socketindex;
            var socketCss = getSocketCss(socketIndex);
         
         $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> File transfer succesfully received from ' + data.username + ': <strong>' + data.name + '</strong></li>')
         
            var savedName = data.name;
            
            $('#download-iframe').attr('src', '/api/download?file=' + savedName);
            
            scrollToBottom();
            playSound();
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
    
          
          
        function audioStreamSocketIo(socket) {
         
            
              console.log("audioStreamSocketIo");
              
             // HERE WE DO THE FILE UPLOAD / STREAM WITH SS
             
            //socket.on('connect', function() {
                
              console.log('SocketIO connection to the server established');

              
                audioContext = initiateAudioContext();

                startTime = 0;
                
                var delayTime = 0;
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
       
                //console.log('receiving audio stream via socket io stream');  
       
                        
                if(localStorage.getItem("stream_state") === "stopped") {
                            
                    return;
                
                } else {
               
                     //console.log(data.buffer);
                  
                    audioContext.decodeAudioData(data.buffer, function(buffer) {
                  
                        audioStack.push(buffer);
                        
                        if ((init!=0) || (audioStack.length > 1)) { // make sure we put at least 10 chunks in the buffer before starting
                            init++;
                            scheduleBuffers();
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
                    
                
                        $('#pause').show();
                  
                       
                    }  
                    
                });
                    
             
            
                 function scheduleBuffers() {
                    while ( audioStack.length) {
                        var buffer = audioStack.shift();
                        var source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioContext.destination);
                        if (nextTime == 0)
                            nextTime = audioContext.currentTime;  /// add 50ms latency to work well across systems - tune this if you like
                        source.start(nextTime);
                        nextTime += source.buffer.duration; // Make the next buffer wait the length of the last buffer before being played
                    };
                }
                                 
                 
                          $('#pause').on('click', function(e) {                
                                audioContext.suspend();
                                
                                $('#pause').hide();
                                $('#resume').show();
                            });
                          
                          
                            $('#resume').on('click', function(e) {                
                                audioContext.resume();
                                
                                $('#resume').hide();
                                $('#pause').show();
                                
                            });
                  
                           
                  
                                                    
                            
                        $('#stop').on('click', function(e) {
                      
                            console.log('stop clicked');
                            
                          e.stopPropagation();
                      
                           socket.emit('stop-audio-stream');
                           
                           //$('#message-results').append('<li class="list-group-item">Outbound stream stopped</li>')
                             
                           localStorage.setItem('stream_state', 'stopped');
                                                         
                              audioContext.close().then(function() {
                                
                                    //audioStreamSocketIo(socket);
                                  console.log('close promise resolved');

                              });
                   
                        });
                  
      
                //});
            
            
            return socket;    
        }
        
               
    $('#listen').on('click', function(e) {
        
        console.log('listen clicked');
        
        //audioStreamSocketIo(socket); 
        
        $.when(
               $('#stop').triggerHandler('click')
        ).done(function() {
                    audioStreamSocketIo(socket); 
        });
            
     });        
         

     
     //var theWavDataInFloat32;


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
              
        $.when(
               $('#stop').triggerHandler('click')
        ).done(function() {
                $('#audio-file').click();
        });   
               
     });
     
     
     
    $('#audio-file').change(function(e) {
    
            console.log('audio file changed');
            
        //$.when(
        
               //$('#stop').triggerHandler('click')
               
        //).done(function() {
   
               //audioStreamSocketIo(socket);
         
         var file = e.target.files[0];
         
        var stream = ss.createStream();
             
        ss(socket).emit('audio-file', stream, { username: localStorage.getItem("username"), sender: tabID, size: file.size, name: file.name, type: file.type});
        ss.createBlobReadStream(file).pipe(stream);

        localStorage.setItem('stream_state', 'started');
        
        $('#message-results').append('<li class="list-group-item list-group-item-info"><strong>' + time + '</strong> Broadcasting stream: <strong>' + file.name + '</strong></li>')

   
        //});

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
    
