var RoomTableItemView = Backbone.View.extend({
         
    initialize: function(options){
                
            //console.log('list item view init');
            this.options = options;
	    this.myUserId = localStorage.getItem("userId");
	    
            //this.render();

    },
    
    render: function(){
        
            var parameters = {
                            linkClass: this.options.linkClass,
                            roomId: this.options.roomId,
                            roomName: this.options.roomName,
                            roomGenre: this.options.roomGenre,
                            numberRoomMembers: this.options.numberRoomMembers,
			    messageCount: this.options.messageCount
                            };
 
        var compiledTemplate = _.template( $("#room_table_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
      
    }
   
    
    
});
       