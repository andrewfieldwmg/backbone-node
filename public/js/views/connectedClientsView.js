var ConnectedClientsView = Backbone.View.extend({
    
    el: $("#connected_clients_container"),
    
    template : _.template( $("#connected_clients_template").html()),
           
    initialize: function(options){
            
            this.options = options;
            
            var self = this;
            
            socket.on('connected-clients', function(data) {
                self.connectedClientsUpdated(data);
            });
            
            this.render();
    },
    
    render: function(){
        
       this.$el.html( this.template );
        
    },

    events: {
   
     
    },
    
    connectedClientsUpdated: function(data) {
     
            console.log('connected clients message received');
            
            $('#connected-clients').html('');
            
            var connectedSocketIds = JSON.parse(data.connectedSocketIds);
            var connectedUsernames = JSON.parse(data.connectedUsernames);
            
            var socketId = localStorage.getItem("socketId").toString();
            var socketIndex = connectedSocketIds.indexOf(socketId);
                
            var socketCss = getSocketCss(socketIndex);
        
            for(i = 0; i < connectedUsernames.length; i++) {
            
                if(connectedUsernames[i] == localStorage.getItem("username")) {
                   var contentFromUsername = "<strong>You</strong> are connected";  
                } else {
                    var contentFromUsername = "<strong>" + connectedUsernames[i] + "</strong> is connected";  
                }
                
                var parameters = {cssClass: "connected-client-list", time: time, contentFromUsername: contentFromUsername, contentName: "", loaderClass: "hidden" }; 
                var listItemView = new ListItemView(parameters);
                
                $('#connected-clients').append(listItemView.render());
    
            }
            
         //console.log(connectedUsernames.length);
            
            if (connectedUsernames.length < 2) {
                      
                console.log('1 client or less');
                
                var messageFormView = new MessageFormView();
                var appControlsView = new AppControlsView();
                var messagesView = new MessagesView();

                    messageFormView.remove();
                    appControlsView.remove();
                    messagesView.remove();
                
                
            } else {
                
                console.log('more than 1 client');
                   
                var messageFormView = new MessageFormView();
                var appControlsView = new AppControlsView();
                var messagesView = new MessagesView();

                if (localStorage.getItem("messageFormViewLoaded") == "false") {
                      messageFormView.render();
                }
                if (localStorage.getItem("appControlsViewLoaded") == "false") {
                      appControlsView.render();
                }
                   
                if (localStorage.getItem("messagesViewLoaded") == "false") {
                      messagesView.render();
                }
                
     
            }

            
    }
    
   
});
