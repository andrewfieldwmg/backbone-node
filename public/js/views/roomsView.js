var RoomsView = Backbone.View.extend({
    
    el: $("#rooms_container"),
    
    template : _.template( $("#rooms_template").html()),
           
    initialize: function(){

            console.log('rooms view init');
            
            var self = this;
            
            socket.on('available-rooms', function(data) {
                self.availableRoomsUpdated(data);
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
         
       localStorage.setItem('roomsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeRoomName") != "") {
            
            $('#rooms-list-header').html('Other Rooms');
        }*/
        
    },

    events: {
   
     "click #open-create-room-form": "openCreateRoomForm"
     
    },
    
    openCreateRoomForm: function(e) {
        
        console.log('open room form');
        
        var roomsFormView = new RoomsFormView();
        roomsFormView.render();
        
    },
  
    availableRoomsUpdated: function(data) {
     
            console.log('connected rooms update message received');
            
            //console.log(data);
            
            $('#available-rooms').html('');
            
            var availableRooms = JSON.parse(data.availableRooms);
            
            console.log(availableRooms);
                  
                if (availableRooms.length === 0) {
                    
                    var roomMessage = "<strong>No rooms</strong> available";
                        var parameters = {cssClass: "connected-client-list", time: time, contentFromUsername: roomMessage, contentName: "", loaderClass: "hidden" }; 
                        
                        var roomListItemView = new RoomListItemView(parameters);
                        $('#available-rooms').append(roomListItemView.render());
  
                } else {
            
                    for(i = 0; i < availableRooms.length; i++) {
                    
                        var usersInRoom = JSON.parse(availableRooms[i].usersInRoom);
                        console.log(usersInRoom);
                        console.log(localStorage.getItem("userId").toString());
                        var index = usersInRoom.indexOf(localStorage.getItem("userId").toString());
                        console.log(index);
                        
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
                                            };
                                            
                                            
                            var roomListItemView = new RoomListItemView(parameters);
                            $('#available-rooms').append(roomListItemView.render());
                            
                        } else {
                            
                            var parameters = {
                           cssClass: "connected-client-list",
                           time: "",
                           linkClass: "disabled",
                           roomId: availableRooms[i].id,
                           roomName: availableRooms[i].name + " - <span class='small'><em>current room</em></span>",
                           };
                                            
                                            
                            var roomListItemView = new RoomListItemView(parameters);
                            $('#available-rooms').append(roomListItemView.render());
                            
                        }
 
                        
                    }
    
                    
                }

    },
    
    remove: function() { 
          
        localStorage.setItem("roomsViewLoaded", "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    },
    
    
   
});