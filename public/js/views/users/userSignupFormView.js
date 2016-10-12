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
	
	//$('#username_form_container').addClass('panel panel-default');
    },
    
    render: function(){
        
	var self = this;
	
	this.$el.html( this.template );
       
	socket.on("user-login-failure", function(data) {
	     self.userLoginFailure(data);
	});
	
	socket.on("user-login-success", function(data) {
	     self.userLoginSuccess(data);
	});
	
	//FAILURES//
	
	socket.on("user-email-taken", function(data) {
	     self.userEmailTaken(data);
	});
		
	socket.on("username-taken", function(data) {
	     self.usernameTaken(data);
	});
	
	
	//SUCCESS//
	
	socket.on("user-email-stored", function(data) {
	     self.userEmailStored(data);
	});

	socket.on("username-stored", function(data) {
	     self.usernameStored(data);
	});
	
	socket.on("user-genre-stored", function(data) {
	     self.userGenreStored(data);
	});
	
	socket.on("user-location-stored", function(data) {
	     self.userLocationStored(data);
	});
	
	socket.on("user-profile-image-stored", function(data) {
	     self.userProfileImageStored(data);
	});
	
	socket.on("user-password-stored", function(data) {
	     self.userPasswordStored(data);
	});
	
	
    },

    events: {
	
        "keyup #username" : "usernameChanging",
        "keyup #user-genre" : "userGenreChanging",
        "keyup #user-location" : "userLocationChanging",
	"keyup #user-email" : "userEmailChanging",
        "keyup #user-password" : "userPasswordChanging",
	"click .start-create-account": "startCreateAccount",
	"submit #login-form" : "submitLoginForm",
        "click #submit-username": "submitUsername",
        "click #submit-user-genre": "submitUserGenre",
        "click #submit-user-location": "submitUserLocation",
	"click #open-profile-image-input": "openProfileImageInput",
	"change #user-profile-image": "submitUserProfileImage",
	"click #submit-user-email": "submitUserEmail",
        "click #submit-user-password": "submitUserPassword"
    },

    submitLoginForm: function(e) {
	
	e.preventDefault();
	
	var loginEmail = $('.login-email').val();
	var loginPassword = $('.login-password').val();
	
	var parameters = {
	    loginEmail: loginEmail,
	    loginPassword: loginPassword
	    };
	
	socket.emit("user-login", parameters);
	
    },
    
    userLoginFailure: function(data) {
	
	showNotification("danger", "Sorry! <strong>We couldn't find that account!</strong> Please try again.");
	
    },
    
    
    userLoginSuccess: function(data) {
	
	var userModel = JSON.parse(data.userModel);
	
	showNotification("success", "Welcome back, <strong>" + userModel.username + "!</strong>");
	
	localStorage.setItem("userId", userModel.id);
	
	$('#username_form_container').removeClass('panel panel-default');
        
	this.remove();
        
	var router = new Router();
	router.navigate("home", {trigger: "true"});

	
    },
    
        
    startCreateAccount: function(e) {
      
	    e.preventDefault();
	    
	    $('.user-login-div').hide();
	    $('#user-email-form').show();
        
    },
    
    
     submitUserEmail: function(e) {
                
        e.preventDefault();
        var userEmail = $('#user-email').val();
    
        socket.emit('new-user-email', {
	    userEmail: userEmail
            });
        
        //localStorage.setItem('userEmail', userEmail);

        
    },
    
        
    userEmailTaken: function(data) {
	
	showNotification("danger", "Sorry,  <strong>that email is already registered!</strong>");
		
    },
    
    userEmailStored: function(data) {
	        
	localStorage.setItem('userId', data.userId);
	
        $('#user-email-form').hide();
        $('#username-form').animate({width: 'toggle'}, 350);
        $('#username').focus();
		
    },
    
    submitUsername: function(e) {
                
        e.preventDefault();
        var username = $('#username').val();
        
        socket.emit('new-username', {
	    userId: localStorage.getItem("userId"),
            username: username
            });
        
        //localStorage.setItem('username', username);
   
    },
    
    usernameTaken: function(data) {
	
	showNotification("danger", "Sorry,  <strong>that username is already taken!</strong>");
		
    },
    
    usernameStored: function(data) {
	
        $('#username-form').hide();
        $('#user-genre-form').animate({width: 'toggle'}, 350);
        $('#user-genre').focus();
		
    },
    
    submitUserGenre: function(e) {
                
        e.preventDefault();
        var userGenre = $('#user-genre').val();
    
        socket.emit('new-user-genre', {
            userId: localStorage.getItem("userId"),
            userGenre: userGenre
            });
        
        //localStorage.setItem('userGenre', userGenre);
         
    },
    
    userGenreStored: function(data) {
	
        $('#user-genre-form').hide();
        $('#user-location-form').animate({width: 'toggle'}, 350);
        $('#user-location').focus();
	
    },
    
    submitUserLocation: function(e) {
                
        e.preventDefault();
        var userLocation = $('#user-location').val();
    
        socket.emit('new-user-location', {
            userId: localStorage.getItem("userId"),
            userLocation: userLocation
            });
        
        //localStorage.setItem('userLocation', userLocation);

    },
    
    userLocationStored: function(e) {
	   
        $('#user-location-form').hide();
        $('#user-profile-image-form').animate({width: 'toggle'}, 350);
	
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
         
        
    },
    
    userProfileImageStored: function(e) {
	   
        $('#user-profile-image-form').hide();
        $('#user-password-form').animate({width: 'toggle'}, 350);
        $('#user-password').focus();
	
    },
    
    submitUserPassword: function(e) {
                
        e.preventDefault();
        var userPassword = $('#user-password').val();
    
        socket.emit('new-user-password', {
            userId: localStorage.getItem("userId"),
            userPassword: userPassword
            });
         
    },
    
    userPasswordStored: function(e) {
	    
	$('#username_form_container').removeClass('panel panel-default');
        
	this.remove();

        var router = new Router();
	router.navigate("welcome", {trigger: "true"});
	
    },
    
    // VALIDATIONS//
    
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

    
   
});