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

     
    },
    
    loadPrivateMessages: function(data) {
        
        var privateMessages = JSON.parse(data.privateMessages);
            
        if (privateMessages.length > 0) {
            
            var dataTable = $('.private-messages-table').DataTable();    
	    dataTable.destroy()
       
             $('#private-messages').empty();
             $('.private-messages-table-head').show();
       
            for(i = 0; i < privateMessages.length; i++) {
                
                    var parameters = {
                                timeSent: privateMessages[i].timeSent,
                                senderUsername: privateMessages[i].senderUsername,
                                messageContent: privateMessages[i].messageContent,
                                status: privateMessages[i].status,
                                positiveButtonClass: "accept-contact-request",
                                positiveButtonText: "Accept"
                                };
            
            var compiledTemplate = _.template( $("#private_message_table_item_template").html(), parameters);
            $('#private-messages').append(compiledTemplate);
            
            }
            
            	 
                 $('.private-messages-table').DataTable({
                    responsive: true,
		    "pageLength": 5
		    });  
            
        }
        
    },
    
    destroy: function() { 

	
	//$('.invitation-modal').modal("hide");
	
        //localStorage.setItem('channelsModalViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        var router = new Router();
        router.navigate("home", {trigger: "true"});
      
    }
    
    
   
});