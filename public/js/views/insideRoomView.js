var InsideRoomView = Backbone.View.extend({
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
        
	localStorage.setItem("activeRoomId", this.options.roomId);
	
    	var connectedClientsView = new ConnectedClientsView();
        connectedClientsView.destroy();
        	        
			
        if (localStorage.getItem("messageFormViewLoaded") == "false") {
            var messageFormView = new MessageFormView();
            messageFormView.afterRender();
        }    
          
        if (localStorage.getItem("messagesViewLoaded") == "false") {
            var messagesView = new MessagesView();
            messagesView.afterRender();
        }
        
         if (localStorage.getItem("appControlsViewLoaded") == "false") {
	    var appControlsView = new AppControlsView();
	    appControlsView.afterRender();
	 }

	if (localStorage.getItem("roomsViewLoaded") == "false") {
	    var roomsView = new RoomsView();
	    roomsView.afterRender();
	}
        	 
	if (localStorage.getItem("clientsInRoomViewLoaded") == "false") {
	    var clientsInRoomView = new ClientsInRoomView({roomid: this.options.roomId});
	    clientsInRoomView.afterRender();
	}   
        
        socket.emit("enter-room", {
	    roomId: this.options.roomId,
	    //roomName: localStorage.getItem("activeRoomName"),
	    userEnteringRoom: localStorage.getItem("userId")
	});
	
	
	socket.emit("refresh-connection", {
				    username: localStorage.getItem("username"),
				    userId: localStorage.getItem("userId"),
				    roomIds:localStorage.getItem("roomIds"),
				    roomName: localStorage.getItem("roomName"),
				    userColour: localStorage.getItem("userColour")
				    }
	);

	
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