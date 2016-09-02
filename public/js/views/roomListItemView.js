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
                            roomName: this.options.roomName,
			    messageCount: this.options.messageCount
                            };
 
        var compiledTemplate = _.template( $("#room_list_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
        "click .enter-room": "enterRoom"
    },
   
    enterRoom: function(e) {
	     
	var requestedRoomId = $(e.currentTarget).data('room-id');
	var requestedRoomName = $(e.currentTarget).data('room-name');

	var router = new Router();
	router.navigate("rooms/" + requestedRoomId, {trigger: "true"}); 
	
      
    }
    
    
});
       