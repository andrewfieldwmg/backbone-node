var UsernameFormView = Backbone.View.extend({
    
    el: $("#username_form_container"),
    
    template : _.template( $("#username_form_template").html()),
           
    initialize: function(){

        console.log('new username form view');
        this.render();
    },
    
    render: function(){
        
       this.$el.html( this.template );
        
    },

    events: {
   
        "click #submit-username": "submitUsername",
        "click #submit-user-genre": "submitUserGenre",
        "click #submit-user-location": "submitUserLocation",
        "click #submit-user-password": "submitUserPassword"
     
    },
    
    submitUsername: function(e) {
                
        console.log('submit username');
        e.preventDefault();
        var username = $('#username').val();
        
        socket.emit('new-username', {
            socketId: localStorage.getItem("socketId"),
            username: username
            });
        
        localStorage.setItem('username', username);
        
        $('#username-form').hide();
        $('#user-genre-form').animate({width: 'toggle'}, 350);
        $('#user-genre').focus();
    },
    
    submitUserGenre: function(e) {
                
        e.preventDefault();
        var userGenre = $('#user-genre').val();
    
        socket.emit('new-user-genre', {
            socketId: localStorage.getItem("socketId"),
            userId: localStorage.getItem("userId"),
            userGenre: userGenre
            });
        
        localStorage.setItem('userGenre', userGenre);
         
        $('#user-genre-form').hide();
        $('#user-location-form').animate({width: 'toggle'}, 350);
        $('#user-location').focus();
        
    },
    
    submitUserLocation: function(e) {
                
        e.preventDefault();
        var userLocation = $('#user-location').val();
    
        socket.emit('new-user-location', {
            socketId: localStorage.getItem("socketId"),
            userId: localStorage.getItem("userId"),
            userGenre: localStorage.getItem("userGenre"),
            userLocation: userLocation
            });
        
        localStorage.setItem('userLocation', userLocation);
         
        $('#user-location-form').hide();
        $('#user-password-form').animate({width: 'toggle'}, 350);
        $('#user-password').focus();
        
    },
    
    submitUserPassword: function(e) {
                
        e.preventDefault();
        var userPassword = $('#user-password').val();
    
        socket.emit('new-user-password', {
            socketId: localStorage.getItem("socketId"),
            userId: localStorage.getItem("userId"),
            userGenre: localStorage.getItem("userGenre"),
            userLocatiom: localStorage.getItem("userLocation"),
            userPassword: userPassword
            });

        
        this.remove();
        
        //var connectedClientsView = new ConnectedClientsView();
        //connectedClientsView.afterRender();

        var router = new Router();
	router.navigate("welcome", {trigger: "true"});
        
        
    }
    

   
});