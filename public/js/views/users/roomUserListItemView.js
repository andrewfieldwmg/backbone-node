var RoomUserListItemView = Backbone.View.extend({
    
    el: $("#connected_clients_container"),
           
    initialize: function(options){
        
        console.log('room user list itemn view init');
        
        this.options = options;
 
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
		
    afterRender: function () {
        
        localStorage.setItem("userListItemViewLoaded", "true");
        
        var parameters = {
			    userId: this.options.connectedUserId,
			    userName: this.options.connectedUsername,
			    cssClass: this.options.cssClass,
                            time: this.options.time,
                            contentFromUsername: this.options.contentFromUsername,
                            contentName: this.options.contentName,
                            loaderClass: this.options.loaderClass,
                            actionIconsClass: this.options.actionIconsClass
                            };
        
        var compiledTemplate = _.template( $("#clients_in_room_list_item_template").html(), parameters);
        return compiledTemplate;
        
    },

    events: {


    },
    
    remove: function() { 
          
        localStorage.setItem("userListItemViewLoaded", "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
   
});
       