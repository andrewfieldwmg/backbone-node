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
    
      },
      
      playFeaturedStream: function(data) {
		  
	    $.ajax({
		url: "/api/getStreamInfo",
		method: "GET",
		data: {
		  streamId: data.streamId
		}
		}).done(function(data) {
    
		  var data = JSON.parse(data);
		  		  
		    new AudioPlayerView({
		      streamName: data.filename,
		      streamId: data.id,
		      userId: data.streamedByUserId,
		      username: data.streamedByUsername,
		      profileImageSrc: config.filePaths.userProfileImageDir + "/" + data.streamedByUserId + "_profile.jpg",
		      streamImageSrc: config.filePaths.waveformDir + "/" + data.id + ".png"
		      });
		    
		    $('.audioplayer-loading-spinner').hide();
			    	    		    
			$('#playSeek').slider({
			 formatter: function(seek) {
			       $("#jplayer-container").jPlayer("playHead", seek);
			 }
			});
			
			  
		      $("#jplayer-container").jPlayer({
			supplied: "mp3",
			wmode: "window",
			errorAlerts: true,
			volume: "0.5",
			   
			loadeddata: function(event){ // calls after setting the song duration
			   
			},
						
			timeupdate: function(event) {
			    
			    var songDuration = event.jPlayer.status.duration;
			    
			    var percentTime = (event.jPlayer.status.currentTime / songDuration) * 100
			    
			    var inversePercentTime = 100 - percentTime;
			    
			    $('#seekSlider').find('.slider-selection').css('width', percentTime + '%')
			    .siblings('.slider-track-high').css('width', inversePercentTime + '%')
			    .siblings('.slider-handle').css('left', percentTime + '%');
			    
			    $('.waveform-image-scroll').css('width', percentTime + '%');
			
			},
			ended: function() {	    
				//$('.jp-next').trigger('click'); 
				
				}		
			});
				    
  		       
			$("#jplayer-container")
			    .jPlayer("setMedia", {mp3: "/uploads/audio/" + data.id + ".mp3" })
			    .jPlayer("play");
  
			localStorage.setItem('streamState', 'started');
		      
		});
		      
	  
                $(document).on('click', '.player-pause-button', function(e) {
		    
		    $("#jplayer-container").jPlayer("pause");
		    
                    $('.player-play-button').show();
                   $('.player-pause-button').hide();
                   
                });
		
			                              
                $(document).on('click', '.player-play-button', function(e) {
                  
		    $("#jplayer-container").jPlayer("play");
                    $('.player-play-button').hide();
                    $('.player-pause-button').show();
                    
                });
      

		      
      }
      
      
  
});