var MessagesView = Backbone.View.extend({
    
    el: $("#messages_container"),
           
    initialize: function(){

            var self = this;
   
             socket.on('message', function (data) {
                 self.socketMessageReceived(data);
             });
	     
	    socket.on('message-history', function (data) {
                 self.updateMessageHistory(data);
             });
     
             socket.on("sent-file-incoming", function(data) {
                 self.socketFileIncoming(data);
             });
         
             socket.on("sent-file", function(data) {
                 self.socketFileReceived(data);
             });
             
            socket.on("file-transfer-finished", function(data) {
                 self.socketSendFileDone(data);
             });

      
    	    socket.on("emptyMessages", function(data) {
                $('#message-results').html();
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
        
        //this.undelegateEvents();
	//this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
    
    
    afterRender: function() {
           
        //console.log('MessagesView rendered');
                 
        localStorage.setItem('messagesViewLoaded', "true");
        //new AudioPlayerView({streamName: "No stream loaded"});
        
        var parameters = {username: localStorage.getItem("username")};
        var compiledTemplate = _.template( $("#messages_template").html(), parameters);
        this.$el.html( compiledTemplate );
         
	 
    },

    events: {
   
    
    },
    

    socketMessageReceived: function(data) {
         
         console.log('message received');

	 if (data.message == null) {
	    
	     $('.feedback-placeholder').html('Feedback will appear here');
	     
	 }
	 
        if (data.channelId != localStorage.getItem("activeChannelId")) {
            
            return;
        
        } else {
	
	
	    if($('.list-group-item[data-id="'+ data.messageId + '"]').length) {
                console.log('that message already exists');
		
	    } else {
		
	    var cssClass = "list-item-" + data.userColour;
	    
	    if(data.username == localStorage.getItem("username")) {
		var senderName = "You";  
	    } else {
		 var senderName = data.username;  
	    }
	     
	    if(data.messageType == "stream") {    	
		var messageIcon = '<i class="fa fa-music"></i>';
	    } else if(data.messageType == "message") {
		 var messageIcon = '<i class="fa fa-envelope"></i>';  
	    }
		
		var parameters = {
				messageId: data.messageId,
				cssClass: cssClass,
				backgroundColour: data.userColour,
				time: time,
				contentFromUsername: senderName + ":",
				contentName: data.message,
				loaderClass: "hidden",
				messageIcon: messageIcon
				};
		
		var listItemView = new ListItemView(parameters);
		
		$('#message-results').append(listItemView.render());
	    }

         $('.feedback-placeholder').hide();
  
            scrollToBottom();
            playSound();
        }
        
    },
    
    
    updateMessageHistory: function(data) {
        
	 if (data.messages == null) {
	    
	     $('.feedback-placeholder').html('Feedback will appear here');
	     return;
	 }
	 
        if (data.channelId != localStorage.getItem("activeChannelId")) {
            
            return;
        
        } else {
    
	    var messageHistory = JSON.parse(data.messages);

	    for(i = 0; i < messageHistory.length; i++) {
	
		if($('.list-group-item[data-id="'+ messageHistory[i].id + '"]').length) {
		    
		    console.log('that message already exists');
		    
		} else {
		    
		    	
		var cssClass = "list-item-" + messageHistory[i].userColour;
		
		if(messageHistory[i].username == localStorage.getItem("username")) {
		    var senderName = "You";  
		} else {
		     var senderName = messageHistory[i].username;  
		}
	     
		if(messageHistory[i].messageType == "stream") {    	
		    var messageIcon = '<i class="fa fa-music"></i>';
		} else if(messageHistory[i].messageType == "message") {
		     var messageIcon = '<i class="fa fa-envelope"></i>';  
		}
	
		    
		    var parameters = {
				    messageId: messageHistory[i].id,
				    cssClass: cssClass,
				    backgroundColour: messageHistory[i].userColour,
				    time: messageHistory[i].createdAt,
				    contentFromUsername: senderName + ":",
				    contentName: messageHistory[i].message,
				    loaderClass: "hidden",
				    messageIcon: messageIcon
				    };
		    
		    var listItemView = new ListItemView(parameters);
    
		    $('#message-results').append(listItemView.render());
		    
		}
	    
	}
	

         $('.feedback-placeholder').hide();
  
            scrollToBottom();
            playSound();
        }
        
    },
    
    socketFileIncoming: function(data) {
        
            //var socketIndex = data.socketindex;
            //var socketCss = getSocketCss(socketIndex);
            var cssClass = "list-item-" + data.userColour;
        
            if(data.username == localStorage.getItem("username")) {
                var senderName = "You";  
            } else {
                 var senderName = data.username;  
            }
                    
            var parameters = {
                            cssClass: cssClass,
                            backgroundColour: data.userColour,
                            time: time,
                            contentFromUsername: "File transfer incoming from " + senderName + ":",
                            contentName: data.name,
                            loaderClass: ""
                            };
            
            var listItemView = new ListItemView(parameters);
            
            $('#message-results').append(listItemView.render());
        
            scrollToBottom();
            playSound();
            
    },
    
    socketFileReceived: function(data) {
        
         //console.log("receiving sent file");
         
           //var socketIndex = data.socketindex;
            //var socketCss = getSocketCss(socketIndex);
            var cssClass = "list-item-" + data.userColour;
            
            if(data.username == localStorage.getItem("username")) {
                var senderName = "You";  
            } else {
                 var senderName = data.username;  
            }
                    
            var parameters = {
                            cssClass: cssClass,
                            backgroundColour: data.userColour,
                            time: time,
                            contentFromUsername: "File transfer received from " + senderName + ":",
                            contentName: data.name,
                            loaderClass: "hidden"
                            };
            
            var listItemView = new ListItemView(parameters);
            
            $('#message-results').append(listItemView.render());
            
            var cleanURL = encodeURIComponent(data.name);

            $('#download-iframe').attr('src', '/api/download?file=' + cleanURL);
            
            $('.fa-refresh').hide();
            
            scrollToBottom();
            playSound();
   
    },
    
    socketSendFileDone: function(data) {
        
      var cssClass = "list-item-" + localStorage.getItem("userColour");
      
        var parameters = {
                      cssClass: cssClass,
                      backgroundColour: localStorage.getItem("userColour"),
                      time: time,
                      contentFromUsername: "File transfer completed: ",
                      contentName: data.name,
                      loaderClass: "hidden"
                      };
      
      var listItemView = new ListItemView(parameters);
      
      $('#message-results').append(listItemView.render());
            
      $('.fa-refresh').hide();
        
    },
 
    remove: function() {
    
        localStorage.setItem("messagesViewLoaded", "false");
        
        //console.log('MessagesView removed');
        
        var self = this;
        socket.off('message');
        socket.off('sent-file-incoming');
        socket.off('sent-file');
        socket.off('file-transfer-finished');
        socket.off('audio-file-incoming');
       
        
       this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
    
    },
    
    
    hide: function() {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.hide(); 
        //Backbone.View.prototype.remove.call(this);

    },
        
    show: function() {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.show();  
        //Backbone.View.prototype.remove.call(this);

    },
    
    destroy: function() { 
        
	//$('.invitation-modal').modal("hide");
	
         localStorage.setItem("messagesViewLoaded", "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.remove();
    }
    
    
      
});
