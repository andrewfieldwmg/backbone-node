var UsernameFormView = Backbone.View.extend({
    
    el: $("#username_form_container"),
    
    template : _.template( $("#username_form_template").html()),
           
    initialize: function(){

            this.render();
    },
    
    render: function(){
        
       this.$el.html( this.template );
        
    },

    events: {
   
     "click #submit-username": "submitUsername"
     
    },
    
    submitUsername: function(e) {
                
        console.log('submit username');
        e.preventDefault();
        var username = $('#username').val();
        
        socket.emit('new-username', { sender: tabID, username: username });
        
        localStorage.setItem('username', username);
         
        this.remove();
         
        new MessageFormView();
        new AppControlsView();
        new ConnectedClientsView();
        new MessagesView();
    }
    
   
});