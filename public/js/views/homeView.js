var HomeView = Backbone.View.extend({
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
		 		 
	 $('#stop').trigger('click');
	 $("#audio_player_container").empty();
	
	if (localStorage.getItem("clientsInRoomViewLoaded") == "true") {
	    var clientsInRoomView = new ClientsInRoomView();
	    clientsInRoomView.destroy();
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

	if (localStorage.getItem("roomsViewLoaded") == "true") {
	    var roomsView = new RoomsView();
	    roomsView.destroy();
	}
	
	/*if (localStorage.getItem("audioPlayerViewLoaded") == "true") {
	    var audioContext = playMp3Stream(socket);
	    var audioPlayerView = new AudioPlayerView({autoRender: false, streamName : "", audioContext: audioContext});
	    audioPlayerView.destroy();
	}*/
        
	var connectedClientsView = new ConnectedClientsView();
	connectedClientsView.afterRender();
       
                if (localStorage.getItem("roomName")) {
                    
                    var roomsView = new RoomsView();
                    roomsView.afterRender();
                }
        
	if (this.options.showWelcome === true) {
	    
		var welcomeModalView = new WelcomeModalView();
		welcomeModalView.afterRender();
	}
	
	socket.emit("refresh-connection", {username: localStorage.getItem("username"),
					    userId: localStorage.getItem("userId"),
					    roomIds: localStorage.getItem("roomIds"),
					    roomName: localStorage.getItem("roomName"),
					    userColour: localStorage.getItem("userColour")
					    }
	);
	        
	
        localStorage.setItem("activeRoomId", "");
        localStorage.setItem("activeRoomName", "");


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