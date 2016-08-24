var RoomListItemView = Backbone.View.extend({
    
    el: $("#rooms_container"),
           
    initialize: function(options){
                
            //console.log('list item view init');
            this.options = options;
	    this.myUserId =  localStorage.getItem("userId");
	    
            //this.render();

    },
    
    render: function(){
        
            var parameters = {
                            cssClass: this.options.cssClass,
                            time: this.options.time,
                            linkClass: this.options.linkClass,
                            roomId: this.options.roomId,
                            roomName: this.options.roomName
                            };
 
        var compiledTemplate = _.template( $("#room_list_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
        "click .enter-room": "enterRoom"
    },
   
    enterRoom: function(e) {
	
        console.log('enter room clicked');
        
	var requestedRoomId = $(e.currentTarget).data('room-id');
	var requestedRoomName = $(e.currentTarget).data('room-name');
        
	localStorage.setItem("activeRoomId", requestedRoomId);
	localStorage.setItem("activeRoomName", requestedRoomName);
	
        var connectedClientsView = new ConnectedClientsView();
        connectedClientsView.destroy();

        
        if (localStorage.getItem("messageFormViewLoaded") == "false") {
            var messageFormView = new MessageFormView();
            messageFormView.afterRender();
        }
        
          
        if (localStorage.getItem("messagesViewLoaded") == "false") {
            var messagesView = new MessagesView();
            messagesView.afterRender();
        }
        
         if (localStorage.getItem("appControlsViewLoaded") == "false") {
	    var appControlsView = new AppControlsView();
	    appControlsView.afterRender();
	 }
	 
	if (localStorage.getItem("clientsInRoomViewLoaded") == "false") {
	    var clientsInRoomView = new ClientsInRoomView();
	    clientsInRoomView.afterRender();
	}

        //var roomsView = new RoomsView();
        //roomsView.afterRender();
	
	socket.emit("enter-room", {roomId: requestedRoomId, roomName: requestedRoomName, userEnteringRoom: this.myUserId });
        
    }
    
    
});
       