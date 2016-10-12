var AudioController = Backbone.Controller.extend({
  
  initialize: function() {
      
      console.log('audio controller init');
      
      localStorage.setItem("audioControllerLoaded", "true");
      
      var self = this;
      
        socket.on("audio-file-incoming", function(data) {
	  //console.log("audio stream incoming handler");
            self.socketAudioStreamIncoming(data); 
         });
     
    },
     
    socketAudioStreamIncoming: function(data) {
      
        console.log('audio stream incoming');
    
	if (localStorage.getItem("userId") != data.userId) {
	    
	  localStorage.setItem('userRole', 'listener');
	    
	      $('#start-recording').addClass('disabled');
	      $('#start-file-stream').addClass('disabled');
	      $('#send-file').addClass("disabled");
	
	  }
			  
	  var cssClass = "list-item-" + data.userColour;
	  
	  var audioType = data.audioType;
	  

	    var audioContext = playMp3Stream(socket, 0);
	
    
            if(data.username == localStorage.getItem("username")) {
               var streamAuthor = "You";
            } else {
                var streamAuthor = data.username;
            }
            
	    if (data.streamType == "featured") {
	    
	      var streamImageSrc = config.filePaths.waveformDir + "/" + data.streamId + ".png";
	    
	    } else {
	      
		var streamImageSrc =  "";
	      
		var parameters = {
				cssClass: cssClass,
				backgroundColour: data.userColour,
				time: time,
				contentFromUsername: 'Audio stream loading from ' + streamAuthor + ':',
				contentName: data.name,
				loaderClass: "",
				messageIcon: '<i class="fa fa-music"></i>'
				};
		
		var listItemView = new ListItemView(parameters);
		
		$('#message-results').append(listItemView.render());    
	    }
	    
	    
            new AudioPlayerView({
		streamName: data.name,
		streamId: data.streamId,
		userId: data.userId,
		username: data.username,
		profileImageSrc: config.filePaths.userProfileImageDir + "/" + data.userId + "_profile.jpg",
		streamImageSrc: streamImageSrc,
		audioContext: audioContext
		});
                    
            localStorage.setItem('streamState', 'started');
            
            scrollToBottom();
            //playSound();
    
    }
  
});