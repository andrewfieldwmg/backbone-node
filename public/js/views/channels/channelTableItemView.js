var ChannelTableItemView = Backbone.View.extend({
         
    initialize: function(options){
                
            //console.log('list item view init');
            this.options = options;
	    this.myUserId = localStorage.getItem("userId");
	    
            //this.render();

    },
    
    render: function(){
        
            var parameters = {
                            linkClass: this.options.linkClass,
                            channelId: this.options.channelId,
                            channelName: this.options.channelName,
                            channelGenre: this.options.channelGenre,
                            numberChannelMembers: this.options.numberChannelMembers,
			    messageCount: this.options.messageCount
                            };
 
        var compiledTemplate = _.template( $("#channel_table_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
      
    }
   
    
    
});
       