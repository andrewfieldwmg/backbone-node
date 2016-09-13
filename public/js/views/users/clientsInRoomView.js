var ClientsInRoomView = Backbone.View.extend({
    
    el: $("#clients_in_room_container"),
           
    initialize: function(options){
            
            this.options = options;
	    this.myUsername = localStorage.getItem("username");
            
            var self = this;
            
            socket.on('connected-clients-in-room', function(data) {
		
	    var usersInRoomName = data.roomName;
	    
		if (usersInRoomName == localStorage.getItem("activeRoomName")) {
		    self.connectedClientsInRoomUpdated(data);
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
        
	$('#clients-in-room').html('');
	
	this.undelegateEvents();
	this.$el.removeData().unbind();
        //this.stopListening();
        
    },
    
    afterRender: function(){
	
	//console.log('CLIENTS in *ROOM* loaded');
        localStorage.setItem("clientsInRoomViewLoaded", "true");
        
            var parameters = {
            roomName: localStorage.getItem("activeRoomName")
            };
            
	    var compiledTemplate = _.template( $("#clients_in_room_template").html(), parameters);
	    this.$el.html( compiledTemplate );
	       
	    if (localStorage.getItem("activeRoomName") != "") {
		
		$('#rooms-list-header').html('Other Rooms');
	    }
	    
		
    },


    events: {

     
    },
    
    connectedClientsInRoomUpdated: function(data) {
               
	    $('#clients-in-room').html('');
	    
	    var otherUsersInRoom = [];
            var usersInRoom = JSON.parse(data.usersInRoom);

            for(i = 0; i < usersInRoom.length; i++) {
		
	    if (usersInRoom[i].inRooms != null && usersInRoom[i].inRooms.indexOf(localStorage.getItem("activeRoomId")) != -1) {
	     
                if(usersInRoom[i].username == localStorage.getItem("username")) {
                       var salutation = "<strong>You</strong> are";
                } else {
			otherUsersInRoom.push(usersInRoom[i].username);
                        var salutation = "<strong>" + usersInRoom[i].username +  "</strong> is";
                }
                                  
		if (usersInRoom[i].status === 'online') {
		       var contentFromUsername = salutation + ' online';
		} else {
		       var contentFromUsername = '<span class="disabled">' + salutation + ' offline</span>';
		}
		
                        var parameters = {
                            connectedUserId: usersInRoom[i].id,
                            connectedUsername: usersInRoom[i].name,
                            cssClass: "connected-client-list",
                            time: "",
                            contentFromUsername: contentFromUsername,
                            contentName: "",
                            loaderClass: "hidden",
                            actionIconsClass: "hidden"
                        };
                        
         
                    var roomUserListItemView = new RoomUserListItemView(parameters);   
                    $('#clients-in-room').append(roomUserListItemView.afterRender());
                    
      
		}
		  
            }
	    
	    if (otherUsersInRoom.length < 1) {
		$('#app_controls_container').addClass("disabled");
	    } else {
		$('#app_controls_container').removeClass("disabled");
	    }
	    
 
    },
    
    destroy: function() { 
        
	//console.log('connected clients remove funciont');
	
	//$('.invitation-modal').modal("hide");

        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.$el.empty();
	
		
        localStorage.setItem("clientsInRoomViewLoaded", "false");
    }
    
   
});
