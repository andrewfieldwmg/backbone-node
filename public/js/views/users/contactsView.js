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
   
        "click .add-to-room": "addToRoom"
     
    },
    
    contactsUpdated: function(data) {
     
            //console.log('connected clients message received');
            
            $('#contacts').html('');
            
            var connectedUsers = JSON.parse(data.connectedUsers);
            //var connectedUsernames = JSON.parse(data.connectedUsernames);
            //var connectedUserIds = JSON.parse(data.connectedUserIds);
            
            //var socketId = localStorage.getItem("socketId").toString();
            //var socketIndex = connectedSocketIds.indexOf(socketId);
            //var socketCss = getSocketCss(socketIndex);
                 //console.log(connectedUsers);

            if (connectedUsers.length < 2) {
                      
                //console.log('1 client or less');
                
                var messageFormView = new MessageFormView();
                var appControlsView = new AppControlsView();
                var messagesView = new MessagesView();
                var roomsView = new RoomsView();
                            
                    messageFormView.remove();
                    appControlsView.remove();
                    messagesView.remove();
                    roomsView.remove();         
                    
                    var parameters = {
                        cssClass: "connected-client-list",
                        time: time,
                        connectedUserMessage: "Just <strong>little old you</strong>, wandering lonely as a cloud...",
                        contentName: "",
                        loaderClass: "hidden"
                        }; 
                    
                    var userListItemView = new UserListItemView(parameters);
                    $('#contacts').append(userListItemView.afterRender());
                
            } else {
                
                //console.log('more than 1 client');
                
                for(i = 0; i < connectedUsers.length; i++) {
                
                if (connectedUsers[i].status === 'online') {
                        
                        var connectedUserId = connectedUsers[i].id;
                        var connectedUsername = connectedUsers[i].username;
                        
                        if(connectedUsername == localStorage.getItem("username")) {
                           var connectedUserMessage = "<strong>You</strong> are connected";
                           var actionIconsClass = "hidden";
                        } else {
                            var connectedUserMessage = "<strong>" + connectedUsername + "</strong> is connected";  
                            var actionIconsClass = "open-create-room-modal";
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
                            userLocation: connectedUsers[i].userLocation,
                            userGenre: connectedUsers[i].userGenre
                            };
                            
             
                        var userListItemView = new UserListItemView(parameters);   
                        $('#contacts').append(userListItemView.afterRender());
                    }
                
                }

            	//var roomsView = new RoomsView();
                //roomsView.afterRender();
                        
     
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
