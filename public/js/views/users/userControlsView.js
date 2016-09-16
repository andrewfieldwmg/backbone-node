var UserControlsView = Backbone.View.extend({
    
    el: $("#user_controls_container"),
    
    template : _.template( $("#user_controls_template").html()),
           
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
	this.myUserId = localStorage.getItem("userId");
               
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
	
        localStorage.setItem('userControlsViewLoaded', "true");
         
       var compiledTemplate = _.template( $("#user_controls_template").html());                     
       this.$el.html( compiledTemplate);
       
    },

    events: {
   
     "click .create-channel": "openCreateChannelForm"
     
    },
    
    openCreateChannelForm: function(e) {
        
        //var channelsFormView = new ChannelsFormView();
        //channelsFormView.render();
        	
	if (localStorage.getItem("channelsModalViewLoaded") =="false") {
        
	    console.log('channels modal view NOT loaded, so proceeding');
        	
	    console.log('open channel modal');
        
	    var parameters = {
			    modalHeaderContent: "Create a <strong>New Channel</strong>",
			    targetUsername: "",
			    targetUserId: "",
                            createChannelFromUserClass: "hidden",
			    createChannelClass: ""
                            };
				
	    var channelsModalView = new ChannelsModalView(parameters);
	    channelsModalView.afterRender();
            
        } else {
            
            console.log('channels modal view ALREADY loaded');
            
        }
        
    },
    
    createChannel: function(e) {
                
        console.log('create channel');
        e.preventDefault();
        e.stopPropagation();
        
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");
	var myUserModel = localStorage.getItem("userModel");
       
        var channelName = $('.create-channel-from-users-name').val();
        
        socket.emit('create-channel', {
                        name: channelName,
                        createdByUserId: myUserId,
                        createdByUsername: myUsername,
                        targetUserId: "",
                        targetUsername: "",
                        createdByUserModel: myUserModel
                        });
	
        //$('#create-channel-from-users').hide();
        //$('.modal').modal("toggle");
    },
    
    
    channelReady: function(data) {
    
	var self = this;
	
	/*if(localStorage.getItem("channelName")) {
	    var channelNameArray = JSON.parse(localStorage.getItem("channelName"));
	} else {
	    var channelNameArray = [];
	}
	
	 channelNameArray.push(data.channelName.toString());
	 var uniqueChannelsArray = Array.from(new Set(channelNameArray));
	 
	 localStorage.setItem('channelName', JSON.stringify(uniqueChannelsArray));
         */
         
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
     
        console.log('channel ready');
     
	var router = new Router();
	router.navigate("channels/" + data.channelId, {trigger: "true"});
	
    },
    
    destroy: function() { 
        
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('userControlsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      this.$el.empty();
    
    }
    
    
   
});