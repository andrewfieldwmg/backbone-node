var RoomsModalView = Backbone.View.extend({
    
    el: $("#rooms_modal_container"),
    
    template : _.template( $("#rooms_modal_template").html()),
           
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
	this.myUserId = localStorage.getItem("userId");
        
        console.log('init rooms modal view');
                       
            socket.on('joined-room-await-others', function(data) {
                self.joinedRoomAwaitOthers(data);
            });
	    
            socket.on('room-invitation-declined', function(data) {
                self.roomInvitationDeclined(data);
            });
                                 
            socket.on('room-ready', function(data) {
                self.roomReady(data);
            });
            
                 
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
        
	var self = this;
	
        localStorage.setItem('roomsModalViewLoaded', "true");
         
	        var parameters = {
                            textInputClass: this.options.textInputClass,
                            modalBodyContent: this.options.modalBodyContent,
                            joinRoomId: this.options.joinRoomId,
                            modalHeaderContent: this.options.modalHeaderContent,
                            targetUsername: this.options.targetUsername,
			    targetUserId: this.options.targetUserId ,
			    createRoomFromUserClass: this.options.createRoomFromUserClass,
			    createRoomClass: this.options.createRoomClass
                            };
                            
       var compiledTemplate = _.template( $("#rooms_modal_template").html(), parameters);                     
       this.$el.html( compiledTemplate);
       
       $('.rooms-modal').modal();
       
            $('.rooms-modal').on('hidden.bs.modal', function () {
		console.log('hidden rooms modal handler');
		self.destroy();
	    });
	    
    },

    events: {
   
     "click #create-room-from-users": "createRoomFromUsers",
     "click #create-room": "createRoom"
     //"submit #create-room-with-user-form" : "createRoomFromUsers"
     
    },
    
    createRoom: function(e) {
                
        console.log('create room');
        e.preventDefault();
        e.stopPropagation();
        
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");
	var myUserModel = localStorage.getItem("userModel");
       
        var roomName = $('.create-room-from-users-name').val();
        
        socket.emit('create-room', {
                                        name: roomName,
                                        createdByUserId: myUserId,
                                        createdByUsername: myUsername,
                                        targetUserId: "",
                                        targetUsername: "",
					createdByUserModel: myUserModel
                                        });
	
        //$('#create-room-from-users').hide();
        //$('.modal').modal("toggle");
    },
    
    createRoomFromUsers: function(e) {
                
        console.log('create room from users');
        e.preventDefault();
        e.stopPropagation();
        
        var targetUserId = $(e.currentTarget).data('target-user-id');
        var targetUsername = $(e.currentTarget).data('target-user-name'); 
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");
	var myUserModel = localStorage.getItem("userModel");
       
        var roomName = $('.create-room-from-users-name[data-target-user-id="'+targetUserId+'"]').val();
        
        socket.emit('create-room-and-invite-user-in', {
                                        name: roomName,
                                        createdByUserId: myUserId,
                                        createdByUsername: myUsername,
                                        targetUserId: targetUserId.toString(),
                                        targetUsername: targetUsername,
					createdByUserModel: myUserModel
                                        });
	
        $('#create-room-from-users').hide();
        //$('.modal').modal("toggle");
    },
    
    joinedRoomAwaitOthers: function(data) {
     
        //localStorage.setItem('roomId', data.roomId);
        //localStorage.setItem('roomName', data.roomName);
          
         $('.create-room-from-users-name').hide();
         $('.create-room-from-users-result')
         .html('<strong>' + data.roomName + '</strong> created!<br><br>Now waiting for <strong>' + data.targetUsername + ' </strong>to accept')
         .append(' <i class="fa fa-refresh fa-spin room-invitation-spinner" title="Loading..." aria-hidden="true" style="display: none"></i>')
         .show();
         
         $('.modal-title').hide();
         $('.room-invitation-spinner').show();
         $('.create-room-from-users').hide();
         
        
    },
    
    acceptRoomInvitation: function(e) {
        
        console.log("accept room invitation");
        
        e.preventDefault();
        //e.stopPropagation();
        
        var invitedRoomId = $(e.currentTarget).data('join-room-id');
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");

        /*socket.emit('join-room', {
                                joiningRoomId: invitedRoomId,
                                joinerUserId: myUserId,
                                joinerUsername: myUsername
                                });*/
        
    },
    
    roomInvitationDeclined: function(data) {

	$('.create-room-from-users-result').html('<strong>Sorry</strong>... ' + data.declinedByUsername + ' is currently busy.');
	
	setTimeout(function(){
	    $('.rooms-modal').modal("hide");
	}, 3000);
    },
    
    roomReady: function(data) {
    
	var self = this;
	
	if(localStorage.getItem("roomName")) {
	    var roomNameArray = JSON.parse(localStorage.getItem("roomName"));
	} else {
	    var roomNameArray = [];
	}
	
	 roomNameArray.push(data.roomName.toString());
	 var uniqueRoomsArray = Array.from(new Set(roomNameArray));
	 
	 localStorage.setItem('roomName', JSON.stringify(uniqueRoomsArray));
	 
	if(localStorage.getItem("roomIds")) {
	    var roomIdArray = JSON.parse(localStorage.getItem("roomIds"));
	} else {
	    var roomIdArray = [];
	}
	
	 roomIdArray.push(data.roomId.toString());
	 var uniqueRoomIdsArray = Array.from(new Set(roomIdArray));
	 localStorage.setItem('roomIds', JSON.stringify(uniqueRoomIdsArray));
	 
	 
	 //localStorage.setItem("activeRoomName", data.roomName);
	 //localStorage.setItem("activeRoomId", data.roomId);
     
        console.log('room ready');
	
         $('.rooms-modal').modal("hide");
     
	var router = new Router();
	router.navigate("rooms/" + data.roomId, {trigger: "true"});
	
    },
    
    destroy: function() { 
        
	console.log('rooms modal remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('roomsModalViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});