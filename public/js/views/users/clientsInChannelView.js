var ClientsInChannelView = Backbone.View.extend({
    
    el: $("#clients_in_channel_container"),
           
    initialize: function(options){
            
            this.options = options;
	    this.myUsername = localStorage.getItem("username");
            
            var self = this;
            
            socket.on('connected-clients-in-channel', function(data) {
		
	    var usersInChannelId = data.channelId;
	    
		if (usersInChannelId == localStorage.getItem("activeChannelId")) {
		    self.connectedClientsInChannelUpdated(data);
		}
                
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
        
	$('#clients-in-channel').html('');
	
	this.undelegateEvents();
	this.$el.removeData().unbind();
        //this.stopListening();
        
    },
    
    afterRender: function(){
	
	//console.log('CLIENTS in *ROOM* loaded');
        localStorage.setItem("clientsInChannelViewLoaded", "true");
        
            var parameters = {
            channelName: localStorage.getItem("activeChannelName")
            };
            
	    var compiledTemplate = _.template( $("#clients_in_channel_template").html(), parameters);
	    this.$el.html( compiledTemplate );
	       
	    if (localStorage.getItem("activeChannelName") != "") {
		
		$('#channels-list-header').html('Other Channels');
	    }
	    
		
    },


     events: {

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
		    
		    $('.send-friendship-request').show();
		
	    });
	
	} else {
	    console.log('user actions modal ALREADY loaded');
	            
	}
     
    },
    
    connectedClientsInChannelUpdated: function(data) {
               
	    console.log("connected clients in room UPDATED:::");
	    
	    var channelClientsTable = $('.channel-clients-table').DataTable();    
	    channelClientsTable.destroy();
	    
	    $('#clients-in-channel').html('');
	    
	    var otherUsersInChannel = [];
            var usersInChannel = JSON.parse(data.usersInChannel);
	    
            for(i = 0; i < usersInChannel.length; i++) {
		
	    if (usersInChannel[i].inChannels != null && usersInChannel[i].currentChannel == localStorage.getItem("activeChannelId")) {
	     
                if(usersInChannel[i].username == localStorage.getItem("username")) {
		    
                       var salutation = "<strong>You</strong> have";
		       var actionIconsClass = "hidden";
		       var username = "You";
		       
                } else {
			otherUsersInChannel.push(usersInChannel[i].username);
                        var salutation = "<strong>" + usersInChannel[i].username +  "</strong> has";
			var actionIconsClass = "open-user-actions";
			 var username = usersInChannel[i].username;
		}
                                  
		if (usersInChannel[i].status === 'online') {
		       var contentFromUsername = salutation + ' joined this channel';
		} else {
		       var contentFromUsername = '<span class="disabled">' + salutation + ' offline</span>';
		}

		    
		    
		        var parameters = {
                            connectedUserId: usersInChannel[i].id,
                            connectedUsername: username,
			    profileImageSrc: config.filePaths.userProfileImageDir + "/" + usersInChannel[i].id + "_profile.jpg",
                            cssClass: "connected-client-list",
                            time: "",
                            connectedUserMessage: "",
                            contentName: "",
                            loaderClass: "hidden",
                            actionIconsClass: actionIconsClass,
                            userLocation: usersInChannel[i].userLocation,
                            userGenre: usersInChannel[i].userGenre
                        };
                            
             
                        var userListItemView = new UserListItemView(parameters);   
                        $('#clients-in-channel').append(userListItemView.afterRender());
			//$('.user-list-action-td').hide();

	     
		}

            }
	    
	    		  
		  		    	
	    $('.channel-clients-table').DataTable({
		   responsive: true,
		   "pageLength": 5,
		   "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]]
		   });
		
			
	    /*if (otherUsersInChannel.length < 1) {
		$('#app_controls_container').addClass("disabled");
	    } else {
		$('#app_controls_container').removeClass("disabled");
	    }*/
	    
 
    },
    
    destroy: function() { 
        
	//console.log('connected clients remove funciont');
	
	//$('.invitation-modal').modal("hide");

        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.$el.empty();
	
		
        localStorage.setItem("clientsInChannelViewLoaded", "false");
    }
    
   
});
