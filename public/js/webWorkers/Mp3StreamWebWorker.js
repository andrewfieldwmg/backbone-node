   /*importScripts('/socket.io/socket.io.js'); 

         var socket = io.connect();
         
         socket.on('connect', function() {       
             console.log("Socket IO connected in web worker");
         });
         
             socket.on('audio', function() {       
             console.log("audio received in web worker");
         });*/

        self.addEventListener('message', function(e) {
          //self.postMessage(e.data);
          //console.log(JSON.parse(e.data));
          
          var array = JSON.parse(e.data);
          var buffer = array.shift();
          
          var bufferString = JSON.stringify(buffer);
          
          self.postMessage(bufferString);
          
        }, false);
                
        