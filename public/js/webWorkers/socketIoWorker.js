   importScripts('/socket.io/socket.io.js'); 

         var socket = io.connect();
         
         socket.on('connect', function() {
             console.log("Socket IO connected in web worker");
         });
         
          socket.on('socket-info', function(data) {
            
            console.log('socket info in web worker');
            localStorage.setItem('socketId', data.socketId);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userEmail", data.userEmail);
            localStorage.setItem("userGenre", data.userGenre);
            localStorage.setItem("userColour", data.userColour);
            localStorage.setItem("userLocation", data.userLocation);
            localStorage.setItem("channelIds", data.inChannels);
            
            localStorage.setItem("userChannelIds", data.inChannels); 
            localStorage.setItem("userChannelNames", data.inChannelNames);
            
         });
                  
          socket.on('audio', function() {       
             console.log("audio received in web worker");
         });

          socket.on('message', function (data) {
                console.log('message received  in web worker!');
                console.log(data);
                self.postMessage(data);
             });
 
        
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
        
        /*self.addEventListener('message', function(e) {
          //self.postMessage(e.data);
          //console.log(JSON.parse(e.data));
          
          var array = JSON.parse(e.data);
          var buffer = array.shift();
          
          var bufferString = JSON.stringify(buffer);
          
          self.postMessage(bufferString);
          
        }, false);*/
                
        