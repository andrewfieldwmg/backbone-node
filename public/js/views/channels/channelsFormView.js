var ChannelsFormView = Backbone.View.extend({
    
    el: $("#channels_form_container"),
    
    template : _.template( $("#channels_form_template").html()),
           
    initialize: function(){
        console.log('init channels form view');
            //this.render();
    },
    
    render: function(){
        
        localStorage.setItem('channelsFormViewLoaded', "true");
         
       this.$el.html( this.template );
        
    },

    events: {
   
     "click #create-channel": "createChannel"
     
    },
    
    createChannel: function(e) {
                
        console.log('create channel');
        e.preventDefault();
        e.stopPropagation();
        
        var askedUserId = $(event.currentTarget).data('id');
        
        var username = localStorage.getItem("username");
        var userId = localStorage.getItem("userId");
        var socketId = localStorage.getItem("socketId");
       
        var channelName = $('#new-channel-name').val();
        console.log(channelName);
        socket.emit('create-new-channel', {
                                        name: channelName,
                                        createdByUserId: userId
                                        
                                        });
        

    },
    
    availableChannelsUpdated: function(data) {
     
    },
    
    remove: function() { 
          
        localStorage.setItem("channelsFormViewLoaded", "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    },
    
    
   
});