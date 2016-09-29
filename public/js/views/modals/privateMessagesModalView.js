var PrivateMessagesModalView = Backbone.View.extend({
    
    el: $("#private_messages_modal_container"),
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;

      
	    socket.on("user-private-messages", function(data) {
		self.loadPrivateMessages(data);
            });
	      
              
            this.render = _.wrap(this.render, function(render) {
                           this.beforeRender();
                           render();						
                           //this.afterRender();
                   });						
                   

        this.render();
        
        socket.emit("get-private-messages", {userId: localStorage.getItem("userId")});
        
        
        
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
        
	var self = this;
	
        //localStorage.setItem('channelsModalViewLoaded', "true");

       var compiledTemplate = _.template( $("#private_messages_modal_template").html());                     
       this.$el.html( compiledTemplate);
       
       $('.private-messages-modal').modal();
       
            $('.private-messages-modal').on('hidden.bs.modal', function () {
		self.destroy();
	    });
	    
    },

    events: {

    "click .delete-message": "deleteMessage",
    "click .accept-contact-request": "acceptContactRequest"
      
    },
    
    loadPrivateMessages: function(data) {
        
        var privateMessages = JSON.parse(data.privateMessages);
            
        if (privateMessages.length > 0) {
            
            var dataTable = $('.private-messages-table').DataTable();    
	    dataTable.destroy()
       
             $('#private-messages').empty();
             $('.private-messages-table-head').show();
       
            for(i = 0; i < privateMessages.length; i++) {
                
                if (privateMessages[i].status == 'unread') {
                 
                    var parameters = {
                                messageId: privateMessages[i].id,
                                timeSent: privateMessages[i].timeSent,
                                senderUsername: privateMessages[i].senderUsername,
				senderUserId: privateMessages[i].senderUserId,
                                messageContent: privateMessages[i].messageContent,
                                status: privateMessages[i].status,
                                positiveButtonClass: "accept-contact-request",
                                positiveButtonText: "Accept"
                                };
                    
                    var compiledTemplate = _.template( $("#private_message_table_item_template").html(), parameters);
                    $('#private-messages').append(compiledTemplate);
                    
                }
                
            }
            
            	 
                 $('.private-messages-table').DataTable({
                    responsive: true,
		    "pageLength": 5,
		    "oLanguage": {
		    "sEmptyTable": "No private messages found"
		    }
		    });  
            
        }
        
    },
    
       
    acceptContactRequest: function(e) {
        
        e.preventDefault();
        
        var requesterUserId = $(e.currentTarget).data('sender-user-id');
        var messageId = $(e.currentTarget).data('message-id');
	 
        socket.emit("accept-contact-request", {
	    userId: localStorage.getItem("userId"),
	    requesterUserId: requesterUserId,
	    messageId: messageId
	    });

	$('tr[data-message-id="' + messageId + '"]').fadeOut("slow");
    },
    
    deleteMessage: function(e) {
        
        e.preventDefault();
        
        var messageId = $(e.currentTarget).data('message-id');
        
        socket.emit("delete-private-message", {messageId: messageId});
        
        $('tr[data-message-id="' + messageId + '"]').fadeOut("slow");
    },
    
    destroy: function() { 

	
	//$('.invitation-modal').modal("hide");
	
        //localStorage.setItem('channelsModalViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        //var router = new Router();
        //router.navigate("home", {trigger: "true"});
      
    }
    
    
   
});