var InsideChannelView = Backbone.View.extend({
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;

	//socket.emit('get-channel-name', {channelId: this.options.channelId});
       
        socket.emit("enter-channel", {
	    channelId: this.options.channelId,
	    //channelName: localStorage.getItem("activeChannelName"),
	    userEnteringChannel: localStorage.getItem("userId")
	});

	 socket.on('entered-channel-details', function(data) {
	    localStorage.setItem("activeChannelId", data.channelId);
	    localStorage.setItem("activeChannelName", data.channelName);
	    $('#channel-name').html(data.channelName);
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
	
         if (localStorage.getItem("appControlsViewLoaded") == "false") {
	    var appControlsView = new AppControlsView();
	    appControlsView.afterRender();
	 }

	//ROOMS
	
	if (localStorage.getItem("userChannelsViewLoaded") == "false") {
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
	    
	
	//if (localStorage.getItem("contactsViewLoaded") == "false") {
	    var contactsView = new ContactsView();
	    contactsView.afterRender();
	//}
	
	//if (localStorage.getItem("clientsInChannelViewLoaded") == "false") {
	    var clientsInChannelView = new ClientsInChannelView({channelid: this.options.channelId});
	    clientsInChannelView.afterRender();
	//}
	
	
	//STREAMS
	
	$('.create-channel-div').hide();
	
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