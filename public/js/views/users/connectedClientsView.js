var ConnectedClientsView = Backbone.View.extend({
    
    el: $("#connected_clients_container"),
    
    template : _.template( $("#connected_clients_template").html()),
           
    initialize: function(options){
            
            console.log('connected clients view loaded');
            this.options = options;
            
            var self = this;
            
            socket.on('connected-clients', function(data) {
                self.connectedClientsUpdated(data);
            });
            
                       
            socket.on('room-invitation', function(data) {
                self.openRoomInvitation(data);
            });

	      socket.on('user-contact-request', function(data) {
                self.openContactInvitation(data);
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
        
        //console.log('rended connected clients');
        localStorage.setItem('connectedClientsViewLoaded', "true");
       this.$el.html( this.template );
        
    },

    events: {
   
        "click .add-to-room": "addToRoom"
     
    },
    
    openContactInvitation: function(data) {
    
    //console.log('invitation ro toom');
        
        if (localStorage.getItem("acceptInvitationViewLoaded") =="false") {
        
        //console.log('accept invitation view NOT loaded');
        
            var parameters = {
			invitedByUsername: data.requesterUsername,
			invitedByUserId: data.requesterUserId,
			joinRoomId: "",
			invitationTo: "Connect",
			};
                                
            var invitationModalView = new InvitationModalView(parameters);
            invitationModalView.afterRender();
            
        } else {
            
            //console.log('accept invitation view ALREADY loaded');
            
        }
        
        //$('.create-room-from-users').hide();
        //$('.accept-room-invitation').show();
    },
    
    openRoomInvitation: function(data) {
    
    //console.log('invitation ro toom');
        
        if (localStorage.getItem("acceptInvitationViewLoaded") =="false") {
        
        //console.log('accept invitation view NOT loaded');
        
            var parameters = {
			invitedByUsername: data.invitedByUsername,
			joinRoomId: data.roomId,
			invitationTo: data.roomName,
			invitedByUserId: data.invitedByUserId
			};
                                
            var invitationModalView = new InvitationModalView(parameters);
            invitationModalView.afterRender();
            
        } else {
            
            //console.log('accept invitation view ALREADY loaded');
            
        }
        
        //$('.create-room-from-users').hide();
        //$('.accept-room-invitation').show();
    },
    
    connectedClientsUpdated: function(data) {
     
            //console.log('connected clients message received');
            var connectedClientsTable = $('.connected-clients-table').DataTable();    
	    connectedClientsTable.destroy();
            
            var connectedUsers = JSON.parse(data.connectedUsers);
	    
	    //console.log(connectedUsers);
            //var connectedUsernames = JSON.parse(data.connectedUsernames);
            //var connectedUserIds = JSON.parse(data.connectedUserIds);
            
            //var socketId = localStorage.getItem("socketId").toString();
            //var socketIndex = connectedSocketIds.indexOf(socketId);
            //var socketCss = getSocketCss(socketIndex);
                 //console.log(connectedUsers);

            //if (connectedUsers.length < 2) {
                      
                //console.log('1 client or less');
                
                /*var messageFormView = new MessageFormView();
                var appControlsView = new AppControlsView();
                var messagesView = new MessagesView();
                var userRoomsView = new UserRoomsView();
                            
                    messageFormView.remove();
                    appControlsView.remove();
                    messagesView.remove();
                    userRoomsView.remove();       
                    
                    var parameters = {
                        cssClass: "connected-client-list",
                        time: time,
                        connectedUserMessage: "Just <strong>little old you</strong>, wandering lonely as a cloud...",
                        contentName: "",
                        loaderClass: "hidden"
                        }; 
                    
                    var userListItemView = new UserListItemView(parameters);
                    $('#connected-clients').append(userListItemView.afterRender());*/  
                
            //} else {
                	    
		$('#connected-clients').html('');
                
                for(i = 0; i < connectedUsers.length; i++) {
                
                if (connectedUsers[i].status === 'online') {
                        
                        var connectedUserId = connectedUsers[i].id;
             
                        if(connectedUsers[i].username == localStorage.getItem("username")) {
                           var connectedUserMessage = "<strong>You</strong> are connected";
                           var actionIconsClass = "hidden";
			   var connectedUsername = "You";
                        } else {
                            var connectedUserMessage = "<strong>" + connectedUsername + "</strong> is connected";  
                            var actionIconsClass = "open-user-actions";
			    var connectedUsername = connectedUsers[i].username;
                        }
                        
                        var parameters = {
                            connectedUserId: connectedUserId,
                            connectedUsername: connectedUsername,
			    profileImageSrc: config.filePaths.userProfileImageDir + "/" + connectedUserId + "_profile.jpg",
                            cssClass: "connected-client-list",
                            time: time,
                            connectedUserMessage: connectedUserMessage,
                            contentName: "",
                            loaderClass: "hidden",
                            actionIconsClass: actionIconsClass,
                            userLocation: connectedUsers[i].userLocation,
                            userGenre: connectedUsers[i].userGenre,
			    userJoinedDate: connectedUsers[i].joinedDate
                            };
                            
             
                        var userListItemView = new UserListItemView(parameters);
		
                        $('#connected-clients').append(userListItemView.afterRender());
                    }
                
                }
                 
		 
                 $('.connected-clients-table').DataTable({
                    responsive: true,
		    "pageLength": 5,
		    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]]
		    });  
            	//var roomsView = new RoomsView();
                //roomsView.afterRender();
                        
     
            //}

            
    },
    
    destroy: function() { 
        
	//console.log('connected clients remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('connectedClientsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.$el.empty();
    }
    
   
});
