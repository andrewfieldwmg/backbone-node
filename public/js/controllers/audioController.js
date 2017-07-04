var AudioController = Backbone.Controller.extend({
  
  initialize: function() {
      
      //console.log('audio controller init');
      
      localStorage.setItem("audioControllerLoaded", "true");
      
      var self = this;
      
        socket.on("audio-file-incoming", function(data) {
	  //console.log("audio stream incoming handler");
            self.socketAudioStreamIncoming(data); 
         });
     
    },
     
    socketAudioStreamIncoming: function(data) {
      
      var self = this;
      
        console.log('audio stream incoming');
    
	window.bufferCounter = 0;
    
	  if (localStorage.getItem("userId") != data.userId) {
	    
	    localStorage.setItem('userRole', 'listener');
	      
		$('#start-recording').addClass('disabled');
		$('#start-file-stream').addClass('disabled');
		//$('#send-file').addClass("disabled");
	
	  }
			  
	    var cssClass = "list-item-" + data.userColour;
	    
	    var audioType = data.audioType;
	    
	    if (localStorage.getItem("playMp3FunctionLoaded") == "false") {
		self.playMp3Stream(socket);
	    }
	
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
		streamImageSrc: streamImageSrc
		});
                    
            localStorage.setItem('streamState', 'started');
            localStorage.setItem('currentStreamId', data.streamId);
	    localStorage.setItem('currentStreamerUserId', data.userId);
	    
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
      

		      
      },
      
   
      startAudioFileStreamAudioElement: function(e) {

	  var self = this;
	  
	  var audioFileInput = $('#audio-file')[0].files[0];
	  var audioTag = document.getElementById('audio-file-element');
	  audioTag.src = URL.createObjectURL(audioFileInput);
	  
	  audioTag.load();
	  audioTag.play();	      
	
	  localStorage.setItem('streamState', '');
	  localStorage.setItem('userRole', 'streamer');

	  self.sendStreamToServer(audioTag, audioFileInput);
	     	
      },
      
      
      sendStreamToServer: function(audioElement, audioFileInput)  {
	    
	    var recording = false;
	    
	    var stream = ss.createStream();
	    
	    var genre = $('.stream-genre').val();
	    
	    ss(socket).emit('audio-file', stream, {
		    userId: localStorage.getItem("userId"),
		    username: localStorage.getItem("username"),
		    activeChannelId: localStorage.getItem("activeChannelId"),
		    activeChannelName: localStorage.getItem("activeChannelName"),
		    userColour: localStorage.getItem("userColour"),
		    liveStream: "false",
		    type: "audio/wav/stream",
		    size: audioFileInput.size,
		    name: audioFileInput.name,
		    genre: genre
		});
	    
	    
		var audioContext = window.audioContext;
		//var sampleRate = audioContext.sampleRate;
		 
		if (typeof audioInput == "undefined") {
		    audioInput = audioContext.createMediaElementSource(audioElement);
		}

		//var audioInput = audioContext.createMediaElementSource(audioElement);
	      
		volume = audioContext.createGain();
		volume.gain.value = 0.5;
		 
		 // connect the stream to the gain node
		audioInput.connect(volume);
	   
		 //leftchannel = [];
		 //rightchannel = [];
		 //var recordingLength = 0;
	    
		 //startRecording();
       
		var bufferSize = 4096;
		var recorder = audioContext.createScriptProcessor(bufferSize, 2, 2);
     
     
		function startRecording() {
  
		    //console.log('window start rec');
		    recording = true;
		    localStorage.setItem('streamState', 'started');
		    
		    $('#start-file-stream').hide();
		    $('#stop-file-stream').show();
		  
		}
		  
		function stopRecording() {
		 
		       recording = false;
		       stream.end();
		       
		       audioElement.pause();
		       audioElement.currentTime = 0;
		       
		       localStorage.setItem('streamState', 'stopped');
		       
		       $('#start-file-stream').show();
		       $('#stop-file-stream').hide();
		 }
		         
			          	      
		$('#stop-file-stream').on('click', function(e) {
		    
		    e.preventDefault();
		    e.stopPropagation();
		    
		    //console.log('Recording stopped');
    
		    stopRecording();
		  
		});
		
	        
		startRecording();
	    
		recorder.onaudioprocess = function(e) {
	    	  
		      if(!recording)  {
			  return;
		      }
   
		      //console.log('recording');
		      
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


		      var interleaved = interleave(left, right);
		      
		      var int16Interleaved = convertoFloat32ToInt16(interleaved);
	
		      stream.write(new ss.Buffer(int16Interleaved));
       
       
		}
     
     
	       volume.connect(recorder);
	       
	       recorder.connect(audioContext.destination);
	     
        	
		  $('#stop-all-audio').on('click', function(e) {
      
		    stopRecording();
		      
			if (localStorage.getItem("streamState") == "started") {
			
			    console.log('stop clicked');
			    
			    e.stopPropagation();
		      
			     socket.emit('stop-audio-stream', {
				 userRole: localStorage.getItem("userRole"),
				 activeChannelId: localStorage.getItem("activeChannelId")
			     });
				  
			   localStorage.setItem('streamState', 'stopped');
	
			     
			}
			
			
			  //if(typeof audioContext != "undefined" && audioContext.state != "closed") {
			      
				  //audioContext.close().then(function() {
	       
				      //console.log('close promise resolved');
				      
				      //var audioPlayer = new AudioPlayerView({streamName : "" });
				      //audioPlayer.destroy();
	  
				  //});
			  
			  //}
						    
		  });
		  
	      
      },
      
      
      playMp3Stream: function(socket) {
	     
	  console.log("PLAY MP3 FUNCTION CALLED");
	  
	  localStorage.setItem("playMp3FunctionLoaded", "true");

	      var audioContext = window.audioContext;
	      
	      //var audioContextLoadedTime = new Date();
		      
	      //var bufferCounter = 0;
	      var audioStack = [];
	      var nextTime = 0;
	      
	      //var i = 0;
	      
	      /*if (currentStreamTime > 0) {
		var offset = currentStreamTime;
	      } else {
		var offset = 0;
	      }*/
	  	 
	      socket.on("audio", function(data) {
       
		console.log('receiving audio stream via socket io stream' + data);  
		  
		  if(localStorage.getItem("streamState") === "stopped") {
			      
		      return;
		  
		  } else {
		      
		      var gainNode = audioContext.createGain();
						
		      if(localStorage.getItem("streamVolume")) {
			  var volumeToUse = localStorage.getItem("streamVolume");
		      } else {
			  var volumeToUse = 1;
		      }
		      
		      gainNode.gain.value = 1;
				      
		      socket.on('set-volume', function (data) {
			      gainNode.gain.value = data.newVolume;
		      });
		      
		  
		      audioContext.decodeAudioData(data.buffer, function(buffer) {
				  	   
			      audioStack.push(buffer);
			      
			      //console.log('buffer counter ' + window.bufferCounter);
			      
			      if (window.bufferCounter == 0) {
			
				  $('.audioplayer-loading-spinner').hide();
				  
				    if(localStorage.getItem("userRole") == 'streamer') {	
					socket.emit("stream-started");
				    }
				  
			      }
			      
			      //if ((bufferCounter != 0) || (audioStack.length > 0)) { // make sure we put at least 10 chunks in the buffer before starting
				  window.bufferCounter++;
				  //scheduleBuffers(gainNode);
			      //}
			    
			      window.source = audioContext.createBufferSource();
			      
			      source.buffer = buffer;
			      
			      source.connect(gainNode);
			      gainNode.connect(audioContext.destination);
			       
			      source.start(nextTime);
			      
			      nextTime += source.buffer.duration; 
    
    
			  }, function (error) {
			      console.error("failed to decode:", error);
			  });
		  
		  
			//$('#pause').show();  
		       
		      }  	     
		    
		  });
		    
      		 
		  /*function scheduleBuffers(gainNode) {
		   
			 while (audioStack.length) {
			      
			  //console.log('schedule buffers');
			  
			    window.source = audioContext.createBufferSource();
				     
			     var buffer = audioStack.shift();
			     
			     source.buffer = buffer;
				   
			     source.connect(gainNode);
			     
			     gainNode.connect(audioContext.destination);
		    
			     if (nextTime == 0)
				 nextTime = audioContext.currentTime + 0.05;  /// add 50ms latency to work well across systems - tune this if you like
				 
			      source.start(nextTime);
			       
			      var sourceStartTime = new Date();
									     
			      var playTimeOffset = (sourceStartTime - audioContextLoadedTime) / 1000;
				  
				   /*if (i === 0) {
				      
					  if(localStorage.getItem("userRole") === "streamer") {
					      
						window.timerInterval = setInterval(function(){
						
						    var currentStreamTime = Math.round(audioContext.currentTime - playTimeOffset);
						    
						    console.log('audiocontext real time: ' + currentStreamTime);
						    
						    socket.emit("update-current-play-time", {channelId: localStorage.getItem("activeChannelId"), currentStreamTime: currentStreamTime });
						
						}, 1000);
				
					 } else {
					    
						 if (typeof window.timerInterval != "undefined") {
						    clearInterval(window.timerInterval);
						  }
					    
					 }
				   
				  }*/
	 
				 
		      $(document).on('click', '.player-play-button', function(e) {
			
			  e.stopPropagation();
			  console.log('play clicked');
			  audioContext.resume();
			  
			  $('.player-play-button').hide();
			  $('.player-pause-button').show();
			  
		      });
	    
	    
		      $(document).on('click', '.player-pause-button', function(e) {
		      
			  e.stopPropagation();
			  console.log('pause clicked');
			  audioContext.suspend();
			  
			  $('.player-play-button').show();
			  $('.player-pause-button').hide();
			 
		      });
		    
		    
				     
		      $('#stop-all-audio').on('click', function(e) {
		      
			  console.log('stop clicked');
			    
			  e.stopPropagation();
			  
			  source.stop();
			  
			  window.bufferCounter = 0;
			   
			  //audioContext.suspend();
		      
			  /*if (typeof window.timerInterval != "undefined") {
			      clearInterval(window.timerInterval);
			  }*/          
		      
			  socket.emit('stop-audio-stream', {
			      userRole: localStorage.getItem("userRole"),
			      activeChannelId: localStorage.getItem("activeChannelId")
			  });
	      
			  localStorage.setItem('streamState', 'stopped');
					
			  var audioPlayer = new AudioPlayerView({streamName : "" });
			  audioPlayer.destroy();	       
						     
			  /*if(typeof audioContext != "undefined" && audioContext.state != "closed") {
			      
				  audioContext.close().then(function() {
	       
				      console.log('close promise resolved');
				      
				      var audioPlayer = new AudioPlayerView({streamName : "" });
				      audioPlayer.destroy();
	  
				  });
			  }*/
	     
	
			    
		      });
		  	  
      
		//});
	    
	      
	      //return audioContext;  
	      //return socket;
	    
	}
	    
      
  
});