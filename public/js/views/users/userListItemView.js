var UserListItemView = Backbone.View.extend({
    
    el: $("#connected_clients_container"),
           
    initialize: function(options){
        
        //console.log('user list itemn view init');
        
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
                            connectedUserMessage: this.options.connectedUserMessage,
                            contentName: this.options.contentName,
                            loaderClass: this.options.loaderClass,
                            actionIconsClass: this.options.actionIconsClass,
			    userLocation: this.options.userLocation,
                            userGenre: this.options.userGenre
                            };
        
        var compiledTemplate = _.template( $("#user_table_item_template").html(), parameters);
        return compiledTemplate;
        
    },

    events: {
   
     "click .open-create-room-modal": "openCreateRoomModal"

    },
    
    openCreateRoomModal: function(e) {
	
        e.stopPropagation();
	
	var clickedUserId = $(e.currentTarget).data('user-id');
	var clickedUserName = $(e.currentTarget).data('user-name');
	
	if (localStorage.getItem("roomsModalViewLoaded") =="false") {
        
	    console.log('rooms modal view NOT loaded, so proceeding');
        	
	    var modalHeaderContent = 'Connect With <strong>'+clickedUserName+'</strong>';
	    console.log('open room modal');
        
	    var parameters = {
			    modalHeaderContent: modalHeaderContent,
			    targetUsername: clickedUserName,
			    targetUserId: clickedUserId,
			    createRoomFromUserClass: "",
			    createRoomClass: "hidden"
                            };
				
	    var roomsModalView = new RoomsModalView(parameters);
	    roomsModalView.afterRender();
            
        } else {
            
            console.log('rooms modal view ALREADY loaded');
            
        }
	
        
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
       