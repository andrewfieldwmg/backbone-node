   importScripts('/socket.io/socket.io.js'); 

         var socket = io.connect();
         
         socket.on('connect', function() {
             console.log("Socket IO connected in web worker");
         });
         
   
   	socket.on("audio", function(data) {
            console.log('receiving audio stream IN WEB WORKER ' + data);  
	    self.postMessage({type: "audio", data: data});
	});
          
           
	/*self.onmessage = function(e) {
            
	    var messageType = e.data.type;
	    
	    var messageData = e.data.data;

	    switch(messageType) {
		
		case "count-private-messages":
		    socket.emit("count-private-messages", {userId: messageData.userId});
		    break;

	    }
	    
	 }*/
         
        /*self.addEventListener('message', function(e) {
          //self.postMessage(e.data);
          //console.log(JSON.parse(e.data));
          
          var array = JSON.parse(e.data);
          var buffer = array.shift();
          
          var bufferString = JSON.stringify(buffer);
          
          self.postMessage(bufferString);
          
        }, false);*/
                
        