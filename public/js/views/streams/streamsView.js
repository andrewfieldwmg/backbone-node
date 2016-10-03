var StreamsView = Backbone.View.extend({
    
    el: $("#featured_streams_container"),
    
    template : _.template( $("#featured_streams_template").html()),
           
    initialize: function(){

            console.log('featured streams init');
            
            var self = this;
            
            socket.on('available-streams', function(data) {
                self.featuredStreamsUpdated(data);
            });
            
            socket.on('message-count-updated-featured-streams', function (data) {
                 self.socketMessageCountUpdated(data);
             });
        	    
	    socket.on('channel-ready', function(data) {
                self.channelReady(data);
            });
            
            this.render = _.wrap(this.render, function(render) {
                       this.beforeRender();
                       render();						
                       //this.afterRender();
               });						
                   
        this.render();
        
    },
  
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
         
       localStorage.setItem('featuredStreamsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeChannelName") != "") {
            
            $('#channels-list-header').html('Other Channels');
        }*/
        
    },

    events: {
   
	"click .enter-channel": "enterChannel",
	"click .create-channel": "createChannel",
	"click .listen-to-featured-stream" : "listenToFeaturedStream",
	"click .stop-featured-stream" : "stopFeaturedStream"
    },
    
  
    featuredStreamsUpdated: function(data) {

            var featuredStreamsDataTable = $('.featured-streams-table').DataTable();
	    featuredStreamsDataTable.destroy();

	    var liveStreamsDataTable = $('.available-streams-table').DataTable();
	    liveStreamsDataTable.destroy();
	    
	    if (data.availableStreams == null) {
		
		$('.loading-streams-td').html('No streams found');
		
	    } else {
	    
            var availableStreams = JSON.parse(data.availableStreams);
                
	    
                if (availableStreams.length === 0) {
                    
                    //var channelMessage = "<strong>No channels</strong> featured";
                        //var parameters = {cssClass: "connected-client-list", time: time, contentFromUsername: channelMessage, contentName: "", loaderClass: "hidden" }; 
                        
                        //var streamTableItemView = new StreamTableItemView(parameters);
                        //$('#featured-streams').append(streamTableItemView.render());
  
                } else {
            	    
                    $('#featured-streams').html('');
                    $('#available-streams').html('');
		    
                    $('.featured-streams-table-head').show();
		    $('.available-streams-table-head').show();
	    
                    for(i = 0; i < availableStreams.length; i++) {
                    
                        /*var usersInChannel = JSON.parse(featuredStreams[i].usersInChannel);
			 var numberUsersInChannel = usersInChannel.length;
			 
                        var index = usersInChannel.indexOf(localStorage.getItem("userId").toString());
                  
                        if (index > -1) {
                            usersInChannel.splice(index, 1);
                        }*/
                
			if(availableStreams[i].streamedByUsername == localStorage.getItem("username")) {
			   var streamedByUsername = "You";
                        } else {
			    var streamedByUsername = availableStreams[i].streamedByUsername;
                        }

			  var justFilename = availableStreams[i].filename.slice(0, -4);
			  
			  						     
			    if (availableStreams[i].state === 'live') {
				
				var listenToStreamClass = "hidden";
			    
			    } else if (availableStreams[i].state === 'offline') {
				
				var listenToStreamClass = "";
			    }
  
                                var parameters = {
                                        streamId: availableStreams[i].id,
                                        streamName: justFilename,
                                        streamGenre: availableStreams[i].genre,
                                        profileImageSrc: config.filePaths.userProfileImageDir + "/" + availableStreams[i].streamedByUserId + "_profile.jpg", 
                                        streamedByUsername: streamedByUsername,
                                        upvotes: availableStreams[i].upvotes,
                                        createdAt: availableStreams[i].createdAt,
                                        channelId: availableStreams[i].channelId,
                                        channelName: availableStreams[i].channelName,
                                        listenButtonClass: "listen-to-featured-stream",
					stopButtonClass: "stop-featured-stream",
					listenToStreamClass: listenToStreamClass
                                        };
                                               				       
					                           
			    var streamTableItemView = new StreamTableItemView(parameters);
								     
			    if (availableStreams[i].state === 'live') {
				
				$('#available-streams').append(streamTableItemView.render());
			    
			    } else if (availableStreams[i].state === 'offline') {
				
				$('#featured-streams').append(streamTableItemView.render());
			    }
			   
		       
                        
                    }
                        
			
			$('.featured-streams-table').DataTable({
			       responsive: true,
			       "pageLength": 5,
			       "order": [[ 0, "desc" ]],
			        "oLanguage": {
				"sEmptyTable": "No streams found"
				},
				"lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]]
			       });
			
			
			$('.available-streams-table').DataTable({
			    responsive: true,
			    "pageLength": 5,
			    "order": [[ 0, "desc" ]],
			     "oLanguage": {
			    "sEmptyTable": "No streams found"
			    },
			    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]]
		       });
                    
		}
	    
	    }

    },
    
    socketMessageCountUpdated: function(data) {
        
        console.log('message count updated');
        
        $('.message-counter[data-channel-id="' + data.channelId + '"]').html(data.messageCount)
        .css('background-color', 'orange')
        .css('color', 'black')
        .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
        .attr('title', 'New Messages!');
    },
    
    
    createChannel: function(e) {
	
	console.log('create channel');
        e.preventDefault();
        e.stopPropagation();

        socket.emit('create-channel', {
		    name: "",
		    createdByUserId: localStorage.getItem("userId"),
		    createdByUsername: localStorage.getItem("username"),
		    targetUserId: "",
		    targetUsername: "",
		    createdByUserModel: localStorage.getItem("userModel")
		    });

    },
    
    channelReady: function(data) {

	/*if(localStorage.getItem("channelName")) {
	    var channelNameArray = JSON.parse(localStorage.getItem("channelName"));
	} else {
	    var channelNameArray = [];
	}
	
	 channelNameArray.push(data.channelName.toString());
	 var uniqueChannelsArray = Array.from(new Set(channelNameArray));
	 
	 localStorage.setItem('channelName', JSON.stringify(uniqueChannelsArray));*/
	 
	 
	if(localStorage.getItem("channelIds")) {
	    var channelIdArray = JSON.parse(localStorage.getItem("channelIds"));
	} else {
	    var channelIdArray = [];
	}
	
	 channelIdArray.push(data.channelId.toString());
	 var uniqueChannelIdsArray = Array.from(new Set(channelIdArray));
	 localStorage.setItem('channelIds', JSON.stringify(uniqueChannelIdsArray));
	 
	 
	 //localStorage.setItem("activeChannelName", data.channelName);
	 //localStorage.setItem("activeChannelId", data.channelId);
     
        console.log('channel ready');

	var router = new Router();
	router.navigate("channels/" + data.channelId, {trigger: "true"});
	
    },
    
    enterChannel: function(e) {
	
	console.log('enterchannel');
	     
	var requestedChannelId = $(e.currentTarget).data('channel-id');
	var requestedChannelName = $(e.currentTarget).data('channel-name');

	//CHANNEL NAMES
	if(localStorage.getItem("channelName")) {
	    var channelNameArray = JSON.parse(localStorage.getItem("channelName"));
	} else {
	    var channelNameArray = [];
	}
	
	 channelNameArray.push(requestedChannelName.toString());
	 var uniqueChannelsArray = Array.from(new Set(channelNameArray));
	 localStorage.setItem('channelName', JSON.stringify(uniqueChannelsArray));
	 
	//CHANNEL IDS
	if(localStorage.getItem("channelIds")) {
	    var channelIdArray = JSON.parse(localStorage.getItem("channelIds"));
	} else {
	    var channelIdArray = [];
	}
	
	 channelIdArray.push(requestedChannelId.toString());
	 var uniqueChannelIdsArray = Array.from(new Set(channelIdArray));
	 localStorage.setItem('channelIds', JSON.stringify(uniqueChannelIdsArray));
							   
	//ROUTER						   
	var router = new Router();
	router.navigate("channels/" + requestedChannelId, {trigger: "true"}); 
	   
    },

    listenToFeaturedStream: function(e) {
	
	var requestedStreamId = $(e.currentTarget).data('stream-id');
		    
               if(localStorage.getItem("streamState") == "started") {
		    $('.stop-featured-stream').trigger('click');
	       }
	       
	$.when(

	).done(function() {
	    
              	localStorage.setItem("streamState", "started");
		
		socket.emit("listen-to-featured-stream", {requestedStreamId: requestedStreamId });
		
		//if (localStorage.getItem("playMp3FunctionLoaded") == "false") {
		    playMp3Stream(socket);
		//}

		    //$('.stop-featured-stream').not("[data-stream-id='" + requestedStreamId + "']").each(function(){
			//$(this).trigger('click');
		    //});
		    
		    
		$('.listen-to-featured-stream[data-stream-id="' + requestedStreamId + '"]').hide();
		$('.stop-featured-stream[data-stream-id="' + requestedStreamId + '"]').show();
		//new AudioPlayerView({streamName : "Loading Live Stream..."});
		

        });
	
    },
    
    stopFeaturedStream: function(e) {
	
	//console.log('stop featured stream click: ' + $(e.currentTarget).data('stream-id'));
	
	var requestedStreamId = $(e.currentTarget).data('stream-id');
	localStorage.setItem("streamState", "stopped");
	
	$('.listen-to-featured-stream[data-stream-id="' + requestedStreamId + '"]').show();
	$('.stop-featured-stream[data-stream-id="' + requestedStreamId + '"]').hide();
	
	socket.emit('stop-featured-audio-stream');
                                                         
	audioContext.close().then(function() {
	  
	      //playMp3Stream(socket);
	    console.log('close promise resolved');

	});
	
    },
    
    remove: function() { 
          
        localStorage.setItem('featuredStreamsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
      
    },
        
    destroy: function() {
        
	console.log('featured streams destroy');
	
        socket.off('featured-streams');
        socket.off('message-count-updated');
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
	//Backbone.View.prototype.remove.call(this);
	
	this.$el.empty();
    }
    
   
});