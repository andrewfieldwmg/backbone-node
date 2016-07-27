var tabID = sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random()
      
        $('#start-recording').on('click', function(e) {
    
        //window.Stream = client.createStream();
            
            if (!navigator.getUserMedia)
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;

                if (navigator.getUserMedia) {
         
                    $('#start-recording').hide();
                    $('#stop-recording').show();
            
                    console.log('Recording');
                
                        navigator.getUserMedia({audio:true}, success, function(e) {
                          alert('Error capturing audio.');
                        });
                      } else alert('getUserMedia not supported in this browser.');
        
              
            var recording = false;
        
            window.startRecording = function() {
              recording = true;
            }
            
        
           window.stopRecording = function() {
                  recording = false;
                  //window.Stream.end();
            }
                
                          
            $('#stop-recording').on('click', function(e) {
                
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Recording stopped');

                recording = false;
                //window.Stream.end();
                
                $('#start-recording').show();
                $('#stop-recording').hide();
 
            });
            

            function success(e) {
        
              // the sample rate is in context.sampleRate
              audioInput = context.createMediaStreamSource(e);
        
              var bufferSize = 2048;
              recorder = context.createScriptProcessor(bufferSize, 1, 1);
        
              recorder.onaudioprocess = function(e){
      
                var left = e.inputBuffer.getChannelData(0);
                //window.Stream.write(convertoFloat32ToInt16(left));
                
                    var file = fs.createWriteStream(convertoFloat32ToInt16(left));
                  
                    file.on('data', function(buffer){
                        io.sockets.emit('recording-input', { buffer: buffer })
                    });
                
              }
        
              audioInput.connect(recorder)
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
            
                startTime = 0;                 
          
        });
            
             
        var socket = io.connect();
                              
        socket.on('connect', function() {       
            console.log("Socket IO connected");
        });
        
        
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
      
            var myWorker = new Worker('web-workers/decodeAudioData.js');
            myWorker.postMessage("hello");
            
            myWorker.onmessage = function(e) {
                console.log(e.data);
            }
            
    
            socket = audioStreamSocketIo();           
            var file = e.target.files[0];
            
            var stream = ss.createStream({
                highWaterMark: 1024,
                objectMode: false,
                allowHalfOpen: false
            });
                 
            ss(socket).emit('file', stream, {size: file.size, name: file.name});
            ss.createBlobReadStream(file).pipe(stream);
            
            localStorage.setItem('stream_state', 'started');
        
        });

   });                              
    