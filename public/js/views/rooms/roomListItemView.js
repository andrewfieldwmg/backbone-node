var RoomListItemView = Backbone.View.extend({
         
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
      
    }
   
    
    
});
       