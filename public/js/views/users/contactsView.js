var ContactsView = Backbone.View.extend({
    
    el: $("#contacts_container"),
    
    template : _.template( $("#contacts_template").html()),
           
    initialize: function(options){
            
            this.options = options;
            
            var self = this;

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
    
    afterRender: function(){
        
        //console.log('rended connected clients');
	localStorage.setItem('contactsViewLoaded', "true");
       this.$el.html( this.template );
        
    },

    events: {
   
        "click .add-to-channel": "addToChannel"
     
    },
    
    contactsUpdated: function(data) {
     
            //console.log('connected clients message received');
            
            var userContacts = JSON.parse(data.userContacts);
            //var connectedUsernames = JSON.parse(data.connectedUsernames);
            //var connectedUserIds = JSON.parse(data.connectedUserIds);
            
            //var socketId = localStorage.getItem("socketId").toString();
            //var socketIndex = connectedSocketIds.indexOf(socketId);
            //var socketCss = getSocketCss(socketIndex);
                 //console.log(userContacts);

            if (userContacts.length === 0) {
                      
                
            } else {
                            
		$('#contacts').html('');
		
		$('.contacts-table-head').show();
                //console.log('more than 1 client');
                
                for(i = 0; i < userContacts.length; i++) {
                
                if (userContacts[i].status === 'online') {
                        
                        var connectedUserId = userContacts[i].id;
                        var connectedUsername = userContacts[i].username;
                        
                        if(connectedUsername == localStorage.getItem("username")) {
                           var connectedUserMessage = "<strong>You</strong> are connected";
                           var actionIconsClass = "hidden";
                        } else {
                            var connectedUserMessage = "<strong>" + connectedUsername + "</strong> is connected";  
                            var actionIconsClass = "open-create-channel-modal";
                        }
                        
                        var parameters = {
                            connectedUserId: connectedUserId,
                            connectedUsername: connectedUsername,
                            cssClass: "connected-client-list",
                            time: time,
                            connectedUserMessage: connectedUserMessage,
                            contentName: "",
                            loaderClass: "hidden",
                            actionIconsClass: actionIconsClass,
                            userLocation: userContacts[i].userLocation,
                            userGenre: userContacts[i].userGenre
                            };
                            
             
                        var userListItemView = new UserListItemView(parameters);   
                        $('#contacts').append(userListItemView.afterRender());
                    }
                
                }

            	//var channelsView = new ChannelsView();
                //channelsView.afterRender();                     
     
            }

            
    },
    
    destroy: function() { 
        
	//console.log('connected clients remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
         localStorage.setItem('contactsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.$el.empty();
    }
    
   
});
