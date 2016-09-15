var UsernameFormView = Backbone.View.extend({
    
    el: $("#username_form_container"),
    
    template : _.template( $("#username_form_template").html()),
           
    initialize: function(){

        console.log('new username form view');
        this.render();
        
        $('#submit-username').prop('disabled', true);
        $('#submit-user-genre').prop('disabled', true);
        $('#submit-user-location').prop('disabled', true);
	$('#submit-user-email').prop('disabled', true);
        $('#submit-user-password').prop('disabled', true);
	
	$('#username_form_container').addClass('panel panel-default');
    },
    
    render: function(){
        
       this.$el.html( this.template );
        
    },

    events: {
        "keyup #username" : "usernameChanging",
        "keyup #user-genre" : "userGenreChanging",
        "keyup #user-location" : "userLocationChanging",
	"keyup #user-email" : "userEmailChanging",
        "keyup #user-password" : "userPasswordChanging",
        "click #submit-username": "submitUsername",
        "click #submit-user-genre": "submitUserGenre",
        "click #submit-user-location": "submitUserLocation",
	"click #open-profile-image-input": "openProfileImageInput",
	"change #user-profile-image": "submitUserProfileImage",
	"click #submit-user-email": "submitUserEmail",
        "click #submit-user-password": "submitUserPassword"
    },
    
    usernameChanging: function(e) {
      
        var usernameLength = $(e.currentTarget).val().length;
        
        if (usernameLength > 2) {
             $('#submit-username').prop('disabled', false);
        } else {
             $('#submit-username').prop('disabled', true);
        }
        
    },
    
    userGenreChanging: function(e) {
      
        var userGenreLength = $(e.currentTarget).val().length;
        
        if (userGenreLength > 2) {
             $('#submit-user-genre').prop('disabled', false);
        } else {
             $('#submit-user-genre').prop('disabled', true);
        }
        
    },
    
    userLocationChanging: function(e) {
      
        var userLocationLength = $(e.currentTarget).val().length;
        
        if (userLocationLength > 2) {
             $('#submit-user-location').prop('disabled', false);
        } else {
             $('#submit-user-location').prop('disabled', true);
        }
        
    },
    
    userEmailChanging: function(e) {
      
        var userEmailLength = $(e.currentTarget).val().length;
        
        if (userEmailLength > 2) {
             $('#submit-user-email').prop('disabled', false);
        } else {
             $('#submit-user-email').prop('disabled', true);
        }
        
    },
    
    userPasswordChanging: function(e) {
      
        var userPasswordLength = $(e.currentTarget).val().length;
        
        if (userPasswordLength > 2) {
             $('#submit-user-password').prop('disabled', false);
        } else {
             $('#submit-user-password').prop('disabled', true);
        }
        
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
        $('#user-profile-image-form').animate({width: 'toggle'}, 350);
        //$('#user-email').focus();
        
    },
    
    openProfileImageInput: function(e) {
	
	e.preventDefault();
	$('#user-profile-image').trigger('click');
	
    },
    
    submitUserProfileImage: function(e) {
                
        e.preventDefault();
	
	var file = $('.user-profile-image')[0].files[0];
	
          var stream = ss.createStream();
                 
            ss(socket).emit('new-user-profile-image', stream, {
                            userId: localStorage.getItem("userId"),
                            size: file.size,
                            name: file.name,
                            type: file.type
                            });
            
        ss.createBlobReadStream(file).pipe(stream);
         
        $('#user-profile-image-form').hide();
        $('#user-email-form').animate({width: 'toggle'}, 350);
        $('#user-email').focus();
        
    },
    
    submitUserEmail: function(e) {
                
        e.preventDefault();
        var userEmail = $('#user-email').val();
    
        socket.emit('new-user-email', {
            socketId: localStorage.getItem("socketId"),
            userId: localStorage.getItem("userId"),
            userGenre: localStorage.getItem("userGenre"),
            userLocation: localStorage.getItem("userLocation"),
	    userEmail: userEmail
            });
        
        localStorage.setItem('userEmail', userEmail);
         
        $('#user-email-form').hide();
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
            userLocation: localStorage.getItem("userLocation"),
	    userEmail: localStorage.getItem("userEmail"),
            userPassword: userPassword
            });

        
	$('#username_form_container').removeClass('panel panel-default');
        
	this.remove();
        
        //var connectedClientsView = new ConnectedClientsView();
        //connectedClientsView.afterRender();

        var router = new Router();
	router.navigate("welcome", {trigger: "true"});
        
        
    }
    
   
});