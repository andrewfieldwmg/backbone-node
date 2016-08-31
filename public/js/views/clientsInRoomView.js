var ClientsInRoomView = Backbone.View.extend({
    
    el: $("#clients_in_room_container"),
           
    initialize: function(options){
            
            this.options = options;
	    this.myUsername = localStorage.getItem("username");
            
            var self = this;
            
            socket.on('connected-clients-in-room', function(data) {
		//localStorage.setItem("activeRoomName", data.roomName);
                self.connectedClientsInRoomUpdated(data);
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
     
            //console.log('UPDATED: clients in room');
                
            $('#clients-in-room').html('');
            
            var usersInRoom = JSON.parse(data.usersInRoom);
            
            for(i = 0; i < usersInRoom.length; i++) {
             
                if(usersInRoom[i].username == localStorage.getItem("username")) {
                       var salutation = "<strong>You</strong> are";
                    } else {
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
                        
         
                    var userListItemView = new UserListItemView(parameters);   
                    $('#clients-in-room').append(userListItemView.afterRender());
                    
            	//var roomsView = new RoomsView();
                //roomsView.afterRender();
                        
          
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
