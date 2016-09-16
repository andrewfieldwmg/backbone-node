var InvitationModalView = Backbone.View.extend({
    
    el: $("#invitation_modal_container"),
           
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
	this.myUserId =  localStorage.getItem("userId");
	this.myUsername = localStorage.getItem("username");
        this.mySocketId = localStorage.getItem("socketId");
         this.myUserModel = localStorage.getItem("userModel");
	 
        console.log('init invitation modal');
                                  
            socket.on('channel-ready', function(data) {
                self.channelReady(data);
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
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
           
	var self = this;
	
        var parameters = {
           invitedByUsername: this.options.invitedByUsername,
           joinChannelId: this.options.joinChannelId,
           invitationTo: this.options.invitationTo,
	   invitedByUserId: this.options.invitedByUserId
           };
           
                            
        localStorage.setItem('acceptInvitationViewLoaded', "true");
         
       var compiledTemplate = _.template( $("#invitation_modal_template").html(), parameters);                     
       this.$el.html( compiledTemplate);
       
       $('.invitation-modal').modal();
       
            $('.invitation-modal').on('hidden.bs.modal', function () {
		console.log('hidden modal handler');
		self.destroy();
	    });
	    
	    /*$('#close-invitation-modal').on('click', function() {
		console.log('close invite modal click handler');
		self.destroy();
	    });*/
	   
    },

    events: {
   
     "click #accept-channel-invitation" : "acceptChannelInvitation",
     "click #decline-channel-invitation" : "declineChannelInvitation"
     
    },
    
    acceptChannelInvitation: function(e) {
        
        console.log("accept channel invitation");
        
        e.preventDefault();
        //e.stopPropagation();
        
        var invitedChannelId = $(e.currentTarget).data('join-channel-id');


        socket.emit('join-channel', {
                                joiningChannelId: invitedChannelId,
                                joinerUserId: this.myUserId,
                                joinerUsername: this.myUsername,
				joinerUserModel: this.myUserModel
                                });
        
    },
    
    declineChannelInvitation: function(e) {
        
        console.log("decline channel invitation");
        
        e.preventDefault();
        //e.stopPropagation();
        
        var invitedChannelId = $(e.currentTarget).data('join-channel-id');
	var invitedByUserId = $(e.currentTarget).data('invited-by-user-id');

        socket.emit('decline-channel-invitation', {		
                                joiningChannelId: invitedChannelId,
				invitedByUserId: invitedByUserId,
				joinerUserId: this.myUserId,
                                joinerUsername: this.myUsername
                                });
	
        $('.invitation-modal').modal("hide");
    },
    
    channelReady: function(data) {
     
	var self = this;
     
        console.log('channel ready');
		
	if(localStorage.getItem("channelName")) {
	    var channelNameArray = JSON.parse(localStorage.getItem("channelName"));
	} else {
	    var channelNameArray = [];
	}
	
	 channelNameArray.push(data.channelName.toString());
	 var uniqueChannelsArray = Array.from(new Set(channelNameArray));
	 
	 localStorage.setItem('channelName', JSON.stringify(uniqueChannelsArray));
	 
	if(localStorage.getItem("channelIds")) {
	    var channelIdArray = JSON.parse(localStorage.getItem("channelIds"));
	} else {
	    var channelIdArray = [];
	}
	
	 channelIdArray.push(data.channelId.toString());
	 var uniqueChannelIdsArray = Array.from(new Set(channelIdArray));
	 localStorage.setItem('channelIds', JSON.stringify(uniqueChannelIdsArray));
	 
	 
	 //localStorage.setItem("activeChannelName", data.channelName);
	 //localStorage.setItem("activeChannelId", data.channelId);
	
         $('.invitation-modal').modal("hide");
	
	var router = new Router();
	router.navigate("channels/" + data.channelId, {trigger: "true"}); 

    },
    
    destroy: function() { 
        
	console.log('invite modal remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('acceptInvitationViewLoaded', "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});