var ListItemView = Backbone.View.extend({
    
    el: $("#messages_container"),
           
    initialize: function(options){
                
            //console.log('list item view init');
            this.options = options;
            //this.render();

    },
    
    render: function(){
        
        var parameters = {
                            messageId: this.options.messageId,
                            cssClass: this.options.cssClass,
                            backgroundColour: this.options.backgroundColour,
                            time: this.options.time,
                            contentFromUsername: this.options.contentFromUsername,
                            contentName: this.options.contentName,
                            loaderClass: this.options.loaderClass,
                            messageIcon: this.options.messageIcon
                            };
        
        var compiledTemplate = _.template( $("#list_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
   
    }
   
});
       