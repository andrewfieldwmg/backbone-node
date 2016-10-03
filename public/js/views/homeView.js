var NewHomeView = Backbone.View.extend({
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
		 		 
	 //$('#stop').trigger('click');
	 
	 $("#audio_player_container").empty().removeClass("marginbottom45");
	
	// DESTROY / CLEAR OUT VIEWS TO STOP ZOMBIES
	
	if (localStorage.getItem("userControlsViewLoaded") == "true") {
	    var userControlsView = new UserControlsView();
	    userControlsView.destroy();
	}
	
	if (localStorage.getItem("clientsInChannelViewLoaded") == "true") {
	    var clientsInChannelView = new ClientsInChannelView();
	    clientsInChannelView.destroy();
	}
	
        if (localStorage.getItem("messageFormViewLoaded") == "true") {
            var messageFormView = new MessageFormView();
            messageFormView.destroy();
        }    
          
        if (localStorage.getItem("messagesViewLoaded") == "true") {
            var messagesView = new MessagesView();
            messagesView.destroy();
        }
        
         if (localStorage.getItem("appControlsViewLoaded") == "true") {
	    var appControlsView = new AppControlsView();
	    appControlsView.destroy();
	 }
	
	
	/*if (localStorage.getItem("audioPlayerViewLoaded") == "true") {
	    var audioContext = playMp3Stream(socket);
	    var audioPlayerView = new AudioPlayerView({autoRender: false, streamName : "", audioContext: audioContext});
	    audioPlayerView.destroy();
	}*/
        
	
        //USERS
	var userControlsView = new UserControlsView();
	userControlsView.afterRender();
	    
	var connectedClientsView = new ConnectedClientsView();
	connectedClientsView.afterRender();
	
       	var contactsView = new ContactsView();
	contactsView.afterRender();
        
	
        //CHANNELS
	
	/*if (localStorage.getItem("userChannelsViewLoaded") == "true") {
	    var userChannelsView = new UserChannelsView();
	    userChannelsView.destroy();
	}*/
        
	var userChannelsView = new UserChannelsView();
	userChannelsView.afterRender();
        
	
        //STREAMS
        
        //var availableStreamsView = new AvailableStreamsView();
	//availableStreamsView.afterRender();

	var streamsView = new StreamsView();
	streamsView.afterRender();
	

	//WELCOME?
        if (this.options.showWelcome === true) {     
                var welcomeModalView = new WelcomeModalView();
                welcomeModalView.afterRender();
        }
	
	
	socket.emit("refresh-connection", {
		    username: localStorage.getItem("username"),
		    userId: localStorage.getItem("userId"),
		    channelIds: localStorage.getItem("channelIds"),
		    channelName: localStorage.getItem("channelName"),
		    userColour: localStorage.getItem("userColour")
		    }
	);
	        
	
        localStorage.setItem("activeChannelId", "");
        localStorage.setItem("activeChannelName", "");


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