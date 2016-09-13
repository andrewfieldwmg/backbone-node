var AvailableRoomsView = Backbone.View.extend({
    
    el: $("#available_rooms_container"),
    
    template : _.template( $("#available_rooms_template").html()),
           
    initialize: function(){

            console.log('available rooms init');
            
            var self = this;
            
            socket.on('available-rooms', function(data) {
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
         
       localStorage.setItem('availableRoomsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeRoomName") != "") {
            
            $('#rooms-list-header').html('Other Rooms');
        }*/
        
    },

    events: {
   
      "click .enter-room": "enterRoom"
     
    },
    
  
    availableRoomsUpdated: function(data) {

            var dataTable = $('.available-rooms-table').DataTable();
	    dataTable.destroy();
	    
            $('#available-rooms').html('');
            
            var availableRooms = JSON.parse(data.availableRooms);
                  
            console.log(availableRooms);
	    
                if (availableRooms.length === 0) {
                    
                    var roomMessage = "<strong>No rooms</strong> available";
                        var parameters = {cssClass: "connected-client-list", time: time, contentFromUsername: roomMessage, contentName: "", loaderClass: "hidden" }; 
                        
                        var roomTableItemView = new RoomTableItemView(parameters);
                        $('#available-rooms').append(roomTableItemView.render());
  
                } else {
            
                    for(i = 0; i < availableRooms.length; i++) {
                    
                        var usersInRoom = JSON.parse(availableRooms[i].usersInRoom);
			 var numberUsersInRoom = usersInRoom.length;
			 
                        var index = usersInRoom.indexOf(localStorage.getItem("userId").toString());
                  
                        if (index > -1) {
                            usersInRoom.splice(index, 1);
                        }
                
                        var roomMessage = "<strong>" + availableRooms[i].name;
                        
                        if(numberUsersInRoom > 1) {
                            var linkClass = "enter-room cursor-pointer";
                        } else {          
                            var linkClass = "disabled";
                        }
                        
                        if (availableRooms[i].name != localStorage.getItem("activeRoomName")) {
                        
                                    var parameters = {
					    linkClass: linkClass,
                                            roomId: availableRooms[i].id,
                                            roomName: availableRooms[i].name,
					    roomGenre: availableRooms[i].roomGenre,
					    numberRoomMembers: numberUsersInRoom,
                                            messageCount: availableRooms[i].messageCount
                                            };
                                            
                                            
                            var roomTableItemView = new RoomTableItemView(parameters);
                            $('#available-rooms').append(roomTableItemView.render());
                            
                        } else {
                            
                            var parameters = {
                           cssClass: "connected-client-list",
                           time: "",
                           linkClass: "disabled",
                           roomId: availableRooms[i].id,
                           roomName: availableRooms[i].name + " - <span class='small'><em>current room</em></span>",
                           messageCount: availableRooms[i].messageCount
                           };
                                            
                                            
                            var roomTableItemView = new RoomTableItemView(parameters);
                            $('#available-rooms').append(roomTableItemView.render());
                            
                        }
 
                        
                    }
    
                    
            }

	$('.available-rooms-table').DataTable({
	       responsive: true });
	     
    },
    
    socketMessageCountUpdated: function(data) {
        
        console.log('message count updated');
        
        $('.message-counter[data-room-id="' + data.roomId + '"]').html(data.messageCount)
        .css('background-color', 'orange')
        .css('color', 'black')
        .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
        .attr('title', 'New Messages!');
    },
    
    enterRoom: function(e) {
	
	console.log('enterroom');
	     
	var requestedRoomId = $(e.currentTarget).data('room-id');
	var requestedRoomName = $(e.currentTarget).data('room-name');

	var router = new Router();
	router.navigate("rooms/" + requestedRoomId, {trigger: "true"}); 
	
      
    },
    
    remove: function() { 
          
        localStorage.setItem('availableRoomsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
      
    },
        
    destroy: function() {
        
	console.log('available rooms destroy');
	
        socket.off('available-rooms');
        socket.off('message-count-updated');
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
	//Backbone.View.prototype.remove.call(this);
	
	this.$el.empty();
    }
    
   
});