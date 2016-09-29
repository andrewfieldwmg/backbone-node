var UserListItemView = Backbone.View.extend({
    
    el: $("#connected_clients_container"),
           
    initialize: function(options){
        
        //console.log('user list itemn view init');
        
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
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function () {
        
        localStorage.setItem("userListItemViewLoaded", "true");
        
        var parameters = {
			    userId: this.options.connectedUserId,
			    profileImageSrc: this.options.profileImageSrc,
			    userName: this.options.connectedUsername,
			    cssClass: this.options.cssClass,
                            time: this.options.time,
                            connectedUserMessage: this.options.connectedUserMessage,
                            contentName: this.options.contentName,
                            loaderClass: this.options.loaderClass,
                            actionIconsClass: this.options.actionIconsClass,
			    userLocation: this.options.userLocation,
                            userGenre: this.options.userGenre,
			    userJoinedDate: this.options.userJoinedDate
                            };
        
        var compiledTemplate = _.template( $("#user_table_item_template").html(), parameters);
        return compiledTemplate;
        
    },

    events: {
   
	"click .open-create-channel-modal": "openCreateChannelModal",
	"click .open-user-actions": "openUserActions"
    },
    
        
    openUserActions: function(e) {
	   
	   console.log('open user actions');
	   
	if (localStorage.getItem("userActionsModalViewLoaded") == "false") {
	    
	    var clickedUserId = $(e.currentTarget).data('user-id'); 
	    socket.emit("get-user", {userId: clickedUserId });
		    
	    socket.on ('get-user-success', function (data) {
    
		var userModel = JSON.parse(data.userModel);
		
		    var parameters = {
			clickedUserId: userModel.id,
			clickedUserName: userModel.username,
			clickedUserGenre: userModel.userGenre,
			clickedUserLocation: userModel.userLocation,
			clickedUserJoinedDate: userModel.joinedDate
		    };
		    
		    var userActionsModalView = new UserActionsModalView(parameters);
		    userActionsModalView.afterRender();
		
	    });
	
	} else {
	    console.log('user actions modal ALREADY loaded');
	            
	}
     
    },
    
    
    openCreateChannelModal: function(e) {
	
        e.stopPropagation();
	
	var clickedUserId = $(e.currentTarget).data('user-id');
	var clickedUserName = $(e.currentTarget).data('user-name');
	
	if (localStorage.getItem("channelsModalViewLoaded") =="false") {
        
	    console.log('channels modal view NOT loaded, so proceeding');
        	
	    var modalHeaderContent = 'Connect With <strong>'+clickedUserName+'</strong>';
	    console.log('open channel modal');
        
	    var parameters = {
			    modalHeaderContent: modalHeaderContent,
			    targetUsername: clickedUserName,
			    targetUserId: clickedUserId,
			    createChannelFromUserClass: "",
			    createChannelClass: "hidden"
                            };
				
	    var channelsModalView = new ChannelsModalView(parameters);
	    channelsModalView.afterRender();
            
        } else {
            
            console.log('channels modal view ALREADY loaded');
            
        }
	
        
    },
    

    remove: function() { 
          
        localStorage.setItem("userListItemViewLoaded", "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
   
});
       