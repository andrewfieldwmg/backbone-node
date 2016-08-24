var ListItemView = Backbone.View.extend({
    
    el: $("#messages_container"),
           
    initialize: function(options){
                
            //console.log('list item view init');
            this.options = options;
            //this.render();

    },
    
    render: function(){
        
        var parameters = {cssClass: this.options.cssClass,
                            time: this.options.time,
                            contentFromUsername: this.options.contentFromUsername,
                            contentName: this.options.contentName,
                            loaderClass: this.options.loaderClass
                            };
        
        var compiledTemplate = _.template( $("#list_item_template").html(), parameters);
        
        return compiledTemplate;
        
    },

    events: {
   
    }
   
});
       