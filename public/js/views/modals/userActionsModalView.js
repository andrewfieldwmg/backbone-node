var UserActionsModalView = Backbone.View.extend({
    
    el: $("#user_actions_modal_container"),
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;

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
        
        this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
        
	var self = this;
	
       localStorage.setItem('userActionsModalViewLoaded', "true");

            var parameters = {
		userId: this.options.clickedUserId,
		username: this.options.clickedUserName,
                userGenre: this.options.clickedUserGenre,
		userLocation: this.options.clickedUserLocation,
		userJoinedDate: this.options.clickedUserJoinedDate
	    };
            
       var compiledTemplate = _.template( $("#user_actions_modal_template").html(), parameters);                     
      this.$el.html(compiledTemplate);
       
       $('.user-actions-modal').modal();
       
            $('.user-actions-modal').on('hidden.bs.modal', function () {
		console.log('user actions modal hidden');
		$('.modal-backdrop').remove();
		$("body").removeClass("modal-open").css("padding-right", "0px");
		self.destroy();
	    });
	    
	      	    
	    /*$(document).on('click', '[data-dismiss="modal"]', function(){
	        $('.user-actions-modal').hide();
	     //$('#user_actions_modal_container').empty();
	       $('.modal-backdrop').remove(); // removes all modal-backdrops
	       $("body").removeClass("modal-open");
	       	self.destroy();
	    });*/

		    
    },

    events: {

        "click .send-friendship-request": "sendContactRequest"
     
    },
    
    sendContactRequest: function(e) {
        
        e.preventDefault();
        
        var recipientUserId = $(e.currentTarget).data("target-user-id");
        var recipientUsername = $(e.currentTarget).data("target-user-name");
        
        socket.emit("user-contact-request",
                    {
                        senderUserId: localStorage.getItem("userId"),
                        senderUsername: localStorage.getItem("username"),
                        recipientUserId: recipientUserId,
                        recipientUsername: recipientUsername
                    });
        
        $(e.currentTarget).html('Contact Request Sent!');
        
        setTimeout(function(){
            $('.user-actions-modal').modal("hide");
            }, 3000);
        
    },
    
    destroy: function() { 

	
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('userActionsModalViewLoaded', "false");
        
        //this.undelegateEvents();
        //this.undelegateEvents();
	this.$el.empty();
	//this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        //var router = new Router();
        //router.navigate("home", {trigger: "true"});
      
    }
    
    
   
});