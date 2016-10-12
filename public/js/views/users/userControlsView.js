var UserControlsView = Backbone.View.extend({
    
    el: $("#user_controls_container"),
    
    template : _.template( $("#user_controls_template").html()),
           
    initialize: function(options){
        
	console.log('user controls init');
	
        var self = this;
        
        this.options = options;
	this.myUserId = localStorage.getItem("userId");
               
            socket.on('channel-ready', function(data) {
                self.channelReady(data);
            });
	    
	    socket.on('user-channels', function(data) {
                //console.log(data);
            });
	    
	      
	    socket.on("private-message-count", function(data) {
		self.updatePrivateMessageCount(data);
            });

		      
            this.render = _.wrap(this.render, function(render) {
                           this.beforeRender();
                           render();						
                           //this.afterRender();
                   });						
                  

        this.render();
	
	socket.emit("count-private-messages", {userId: localStorage.getItem("userId")});
        
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
   
     "click .create-channel": "openCreateChannelForm",
     "click .open-private-messages" : "openPrivateMessages"
     
    },
    
    updatePrivateMessageCount: function(data) {
	
	//console.log('private messages updated');
	
	if (data.updateType == "new") {
	    
	      $('.private-message-counter').html(data.messageCount)
	     .css('background-color', 'orange')
	     .css('color', 'black')
	     .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
	     .attr('title', 'New Messages!');
	     
	} else {
	    
	    $('.private-message-counter').html(data.messageCount);
	}
		
    },
    
    openPrivateMessages: function(e) {
	
	    //console.log('open priv mess');
	    var privateMessagesModalView = new PrivateMessagesModalView();
	    privateMessagesModalView.afterRender();
	    
    },
    
    openCreateChannelForm: function(e) {
        
        //var channelsFormView = new ChannelsFormView();
        //channelsFormView.render();
        	
	if (localStorage.getItem("channelsModalViewLoaded") == "false") {
        
	    //console.log('channels modal view NOT loaded, so proceeding');
        	
	    //console.log('open channel modal');
        
	if(localStorage.getItem("userChannelIds")) {
	    var chooseExistingChannelClass = "";
	    var createChannelClass = "hidden";
	    var createChannelSubmitClass = "enter-channel";
	    var userChannelIdArray = JSON.parse(localStorage.getItem("userChannelIds"));
	    var userChannelNameArray = JSON.parse(localStorage.getItem("userChannelNames"));
	    var modalHeaderContent = "Choose a <strong>Stream Channel</strong>";
	} else {
	    var chooseExistingChannelClass = "hidden";
	    var createChannelClass = "";
	    var createChannelSubmitClass = "create-channel";
	    var userChannelIdArray = null;
	    var userChannelNameArray = null;
	    var modalHeaderContent = "Create a <strong>Stream Channel</strong>";
	}
	
	    var parameters = {
			    modalHeaderContent: modalHeaderContent,
			    targetUsername: "",
			    targetUserId: "",
                            createChannelFromUserClass: "hidden",
			    createChannelClass: createChannelClass,
			    chooseExistingChannelClass: chooseExistingChannelClass,
			    createChannelSubmitClass: createChannelSubmitClass,
			    userChannelIdArray: userChannelIdArray,
			    userChannelNameArray: userChannelNameArray
                            };
				
	    var channelsModalView = new ChannelsModalView(parameters);
	    channelsModalView.afterRender();
            
        } else {
            
            //console.log('channels modal view ALREADY loaded');
            
        }
        
    },
    
    createChannel: function(e) {
                
        //console.log('create channel');
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
	
	//console.log(data);
	/*if(localStorage.getItem("channelName")) {
	    var channelNameArray = JSON.parse(localStorage.getItem("channelName"));
	} else {
	    var channelNameArray = [];
	}
	
	 channelNameArray.push(data.channelName.toString());
	 var uniqueChannelsArray = Array.from(new Set(channelNameArray));
	 
	 localStorage.setItem('channelName', JSON.stringify(uniqueChannelsArray));
         */
         
	if(localStorage.getItem("channelIds") !== null && localStorage.getItem("channelIds") !== "null") {
	    var channelIdArray = JSON.parse(localStorage.getItem("channelIds"));
	} else {
	    var channelIdArray = [];
	}
	
	 channelIdArray.push(data.channelId.toString());
	 var uniqueChannelIdsArray = Array.from(new Set(channelIdArray));
	 localStorage.setItem('channelIds', JSON.stringify(uniqueChannelIdsArray));
	 	 
		if (data.createdByUserId == localStorage.getItem("userId")) {
		   
		//CHANNEL IDS 
		    if(localStorage.getItem("userChannelIds") !== null) {
			var userChannelIdArray = JSON.parse(localStorage.getItem("userChannelIds"));
		    } else {
			var userChannelIdArray = [];
		    }
		    
		     userChannelIdArray.push(data.channelId.toString());
		     var uniqueUserChannelIdArray = Array.from(new Set(userChannelIdArray));
		     localStorage.setItem('userChannelIds', JSON.stringify(uniqueUserChannelIdArray));
		
		//CHANNEL NAMES
		    if(localStorage.getItem("userChannelNames") !== null) {
			var userChannelNameArray = JSON.parse(localStorage.getItem("userChannelNames"));
		    } else {
			var userChannelNameArray = [];
		    }
		    
		     userChannelNameArray.push(data.channelName.toString());
		     var uniqueUserChannelNameArray = Array.from(new Set(userChannelNameArray));
		     localStorage.setItem('userChannelNames', JSON.stringify(uniqueUserChannelNameArray));
		}
	 
	 //localStorage.setItem("activeChannelName", data.channelName);
	 //localStorage.setItem("activeChannelId", data.channelId);
     
        //console.log('channel ready');
     
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