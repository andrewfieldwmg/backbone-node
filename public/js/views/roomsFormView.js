var RoomsFormView = Backbone.View.extend({
    
    el: $("#rooms_form_container"),
    
    template : _.template( $("#rooms_form_template").html()),
           
    initialize: function(){
        console.log('init rooms form view');
            //this.render();
    },
    
    render: function(){
        
        localStorage.setItem('roomsFormViewLoaded', "true");
         
       this.$el.html( this.template );
        
    },

    events: {
   
     "click #create-room": "createRoom"
     
    },
    
    createRoom: function(e) {
                
        console.log('create room');
        e.preventDefault();
        e.stopPropagation();
        
        var askedUserId = $(event.currentTarget).data('id');
        
        var username = localStorage.getItem("username");
        var userId = localStorage.getItem("userId");
        var socketId = localStorage.getItem("socketId");
       
        var roomName = $('#new-room-name').val();
        console.log(roomName);
        socket.emit('create-new-room', {
                                        name: roomName,
                                        createdByUserId: userId
                                        
                                        });
        

    },
    
    availableRoomsUpdated: function(data) {
     
    },
    
    remove: function() { 
          
        localStorage.setItem("roomsFormViewLoaded", "false");
        
        //this.undelegateEvents();
        this.$el.empty().off(); 
        this.stopListening();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    },
    
    
   
});