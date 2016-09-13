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

	if (localStorage.getItem("userRoomsViewLoaded") == "true") {
	    var userRoomsView = new UserRoomsView();
	    userRoomsView.destroy();
	}
	
	if (localStorage.getItem("availableRoomsViewLoaded") == "true") {	
	    var availableRooms = new AvailableRoomsView();
	    availableRooms.destroy();
	}
	
	/*if (localStorage.getItem("audioPlayerViewLoaded") == "true") {
	    var audioContext = playMp3Stream(socket);
	    var audioPlayerView = new AudioPlayerView({autoRender: false, streamName : "", audioContext: audioContext});
	    audioPlayerView.destroy();
	}*/
        
	
	var connectedClientsView = new ConnectedClientsView();
	connectedClientsView.afterRender();
	
       	var contactsView = new ContactsView();
	contactsView.afterRender();
	
	var availableRooms = new AvailableRoomsView();
	availableRooms.afterRender();
	
	
	    if (localStorage.getItem("roomName")) {
		
		var userRoomsView = new UserRoomsView();
		userRoomsView.afterRender();
	    }

		if (this.options.showWelcome === true) {
		    
			var welcomeModalView = new WelcomeModalView();
			welcomeModalView.afterRender();
		}
	
	socket.emit("refresh-connection", {
		    username: localStorage.getItem("username"),
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