var ChannelListItemView = Backbone.View.extend({
         
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
                            channelId: this.options.channelId,
                            channelName: this.options.channelName,
			    messageCount: this.options.messageCount
                            };
 
        var compiledTemplate = _.template( $("#channel_list_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
      
    }
   
    
    
});
       