var StreamTableItemView = Backbone.View.extend({
         
    initialize: function(options){
                
            //console.log('list item view init');
            this.options = options;
	    this.myUserId = localStorage.getItem("userId");
	    
            //this.render();

    },
    
    render: function(){
        
            var parameters = {
                            streamId: this.options.streamId,
                            streamName: this.options.streamName,
                            streamGenre: this.options.streamGenre,
			    profileImageSrc: this.options.profileImageSrc,
                            streamedByUsername: this.options.streamedByUsername,
			    upvotes: this.options.upvotes,
			    createdAt: this.options.createdAt,
			    channelId: this.options.channelId,
			    channelName: this.options.channelName,
			    listenButtonClass: this.options.listenButtonClass,
			    stopButtonClass: this.options.stopButtonClass,
			    listenToStreamClass: this.options.listenToStreamClass
                            };

        var compiledTemplate = _.template( $("#stream_table_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {

    }
   
  
});
       