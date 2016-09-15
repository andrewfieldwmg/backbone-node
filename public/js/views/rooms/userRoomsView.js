var UserRoomsView = Backbone.View.extend({
    
    el: $("#user_rooms_container"),
    
    template : _.template( $("#user_rooms_template").html()),
           
    initialize: function(){

            //console.log('rooms view init');
            
            var self = this;
            
            socket.on('user-rooms', function(data) {
                self.availableRoomsUpdated(data);
            });
            
            socket.on('message-count-updated', function (data) {
                 self.socketMessageCountUpdated(data);
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
         
       localStorage.setItem('userRoomsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeRoomName") != "") {
            
            $('#rooms-list-header').html('Other Rooms');
        }*/
        
    },

    events: {
   
     "click #open-create-room-form": "openCreateRoomForm",
     "click .enter-room": "enterRoom"
     
    },
    
    enterRoom: function(e) {
	
	console.log('enterroom');
	     
	var requestedRoomId = $(e.currentTarget).data('room-id');
	var requestedRoomName = $(e.currentTarget).data('room-name');

	var router = new Router();
	router.navigate("channels/" + requestedRoomId, {trigger: "true"}); 
	
      
    },
    
    openCreateRoomForm: function(e) {
        
        //var roomsFormView = new RoomsFormView();
        //roomsFormView.render();
        	
	if (localStorage.getItem("roomsModalViewLoaded") =="false") {
        
	    console.log('rooms modal view NOT loaded, so proceeding');
        	
	    console.log('open room modal');
        
	    var parameters = {
			    modalHeaderContent: "Create a <strong>New Channel</strong>",
			    targetUsername: "",
			    targetUserId: "",
                            createRoomFromUserClass: "hidden",
			    createRoomClass: ""
                            };
				
	    var roomsModalView = new RoomsModalView(parameters);
	    roomsModalView.afterRender();
            
        } else {
            
            console.log('rooms modal view ALREADY loaded');
            
        }
        
    },
  
    availableRoomsUpdated: function(data) {

            //console.log(data);
     
            var availableRooms = JSON.parse(data.availableRooms);
                  
                if (availableRooms.length === 0) {
                    
  
                } else {
                   
		    $('#user-rooms').html('');
		
                    for(i = 0; i < availableRooms.length; i++) {
                    
                        var usersInRoom = JSON.parse(availableRooms[i].usersInRoom);
                        var index = usersInRoom.indexOf(localStorage.getItem("userId").toString());
                  
                        if (index > -1) {
                            usersInRoom.splice(index, 1);
                        }

                        var numberUsersInRoom = usersInRoom.length;
                        
                        var roomMessage = "<strong>" + availableRooms[i].name;
                        
                        if(numberUsersInRoom > 1) {
                            var linkClass = "enter-room cursor-pointer";
                        } else {          
                            var linkClass = "disabled";
                        }
                        
                        if (availableRooms[i].name != localStorage.getItem("activeRoomName")) {
                        
                                    var parameters = {
                                            cssClass: "connected-client-list",
                                            time: "",
                                            linkClass: "enter-room cursor-pointer",
                                            roomId: availableRooms[i].id,
                                            roomName: availableRooms[i].name,
                                            messageCount: availableRooms[i].messageCount
                                            };
                                            
                                            
                            var roomListItemView = new RoomListItemView(parameters);
                            $('#user-rooms').append(roomListItemView.render());
                            
                        } else {
                            
                            var parameters = {
                           cssClass: "connected-client-list",
                           time: "",
                           linkClass: "disabled",
                           roomId: availableRooms[i].id,
                           roomName: availableRooms[i].name + " - <span class='small'><em>current channel</em></span>",
                           messageCount: availableRooms[i].messageCount
                           };
                                            
                                            
                            var roomListItemView = new RoomListItemView(parameters);
                            $('#user-rooms').append(roomListItemView.render());
                            
                        }
 
                        
                    }
    
                    
            }

    },
    
    socketMessageCountUpdated: function(data) {
        
        console.log('message count updated');
        
        $('.message-counter[data-room-id="' + data.roomId + '"]').html(data.messageCount)
        .css('background-color', 'orange')
        .css('color', 'black')
        .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
        .attr('title', 'New Messages!');
    },
    
    remove: function() { 
          
        localStorage.setItem('userRoomsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
      
    },
        
    destroy: function() {
        
        socket.off('user-rooms');
        socket.off('message-count-updated');
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.remove();
    }
    
   
});