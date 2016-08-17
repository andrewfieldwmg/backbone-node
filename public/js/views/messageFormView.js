var MessageFormView = Backbone.View.extend({
    
    el: $("#message_form_container"),
           
    initialize: function(){

            this.render();
    },
    
    render: function(){
        
        var parameters = {username: localStorage.getItem("username")};
        var compiledTemplate = _.template( $("#message_form_template").html(), parameters);
        this.$el.html( compiledTemplate );
        
    },

    events: {
   
         "click #submit-message": "submitMessage"
     
    },
    
    submitMessage: function(e) {
            
        console.log('submit message');
        e.preventDefault();
        var message = $('#message-text').val();
        
        socket.emit('message', { sender: tabID, username: localStorage.getItem("username"), message: message });
        
        $('#message-text').val("");
        
    
    }
    
   
});
