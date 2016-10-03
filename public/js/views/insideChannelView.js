var InsideChannelView = Backbone.View.extend({
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;

	//socket.emit('get-channel-name', {channelId: this.options.channelId});
  
	if (localStorage.getItem("channelIds").indexOf(this.options.channelId) == -1) {
	    
	  	var router = new Router();
		router.navigate("home", {trigger: "true"});
		return;
	} 
  
  
	 socket.on('entered-channel-details', function(data) {
	    
		var channel = JSON.parse(data.channel);
		localStorage.setItem("activeChannelId", channel.id);
		localStorage.setItem("activeChannelName", channel.name);
		
		$('#channel-name').html(channel.name);
		
		    if (channel.currentStreamStatus === 'started') {
			
			console.log('there is an active stream');
			
				if(localStorage.getItem("streamState") == "started") {
				    
				      $('.stop-featured-stream').trigger('click');
				      
				}
			
			     $.when(
		     
				$('#start-recording').addClass('disabled'), $('#start-file-stream').addClass('disabled'), $('#send-file').addClass("disabled")
			     
			     ).done(function() {
				 
				     localStorage.setItem("streamState", "started");
				     
				     socket.emit("listen-to-featured-stream", {requestedStreamId:  channel.currentStreamId });
								 
				     new AudioPlayerView({streamName : channel.currentStreamName });
				     
				     playMp3Stream(socket);
				     
			     });
		    
	
		    
		}
	 
	 });

		
	socket.emit("refresh-connection", {
	    
		    username: localStorage.getItem("username"),
		    userId: localStorage.getItem("userId"),
		    channelIds:localStorage.getItem("channelIds"),
		    channelName: localStorage.getItem("channelName"),
		    userColour: localStorage.getItem("userColour")
		    
		    }
	);

	
        /*var availableChannelsView = new AvailableChannelsView();
	availableChannelsView.destroy();*/
	
	
	//MESSAGES
	
	if (localStorage.getItem("messageFormViewLoaded") == "false") {
            var messageFormView = new MessageFormView();
            messageFormView.afterRender();
        }    
        					
        $('#message-results').empty();
	
        if (localStorage.getItem("messagesViewLoaded") == "false") {
            var messagesView = new MessagesView();
            messagesView.afterRender();
        }
        
	
	//APP CONTROLS
	if (isWebkit && !isMobileOrTablet()) {

		if (localStorage.getItem("appControlsViewLoaded") == "false") {
		   var appControlsView = new AppControlsView();
		   appControlsView.afterRender();
		}
		   
	       //$('#wrong_browser').show();
	       //return;
	}
	 
	//CHANNELS
	
	if (localStorage.getItem("userChannelsViewLoaded") === "false") {
	    var userChannelsView = new UserChannelsView();
	    userChannelsView.afterRender();
	}

	
	//USERS
		
    	var connectedClientsView = new ConnectedClientsView();
        connectedClientsView.destroy();
	
	if (localStorage.getItem("userControlsViewLoaded") == "true") {
	    var userControlsView = new UserControlsView();
	    userControlsView.destroy();
	}
	    	
	if (localStorage.getItem("contactsViewLoaded") == "false") {
	    var contactsView = new ContactsView();
	    contactsView.afterRender();
	}
	
	if (localStorage.getItem("clientsInChannelViewLoaded") == "false") {
	    var clientsInChannelView = new ClientsInChannelView({channelid: this.options.channelId});
	    clientsInChannelView.afterRender();
	}
	
	
	//STREAMS
	
	//$('.create-channel-div').hide();
	//var availableStreamsView = new AvailableStreamsView();
	//availableStreamsView.afterRender();

	var streamsView = new StreamsView();
	streamsView.afterRender();
	
	
	//new AudioPlayerView({streamName : "No Stream Loaded"});
			    
        socket.emit("enter-channel", {
	    channelId: this.options.channelId,
	    //channelName: localStorage.getItem("activeChannelName"),
	    userEnteringChannel: localStorage.getItem("userId")
	});
	
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
        
    },

    events: {
   
    },
    
    destroy: function() { 

        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});