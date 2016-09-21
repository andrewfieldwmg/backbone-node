var ChannelsModalView = Backbone.View.extend({
    
    el: $("#channels_modal_container"),
    
    template : _.template( $("#channels_modal_template").html()),
           
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
	this.myUserId = localStorage.getItem("userId");
        
        console.log('init channels modal view');
                       
            socket.on('joined-channel-await-others', function(data) {
                self.joinedChannelAwaitOthers(data);
            });
	    
            socket.on('channel-invitation-declined', function(data) {
                self.channelInvitationDeclined(data);
            });
                                 
            socket.on('channel-ready', function(data) {
                self.channelReady(data);
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
	
        localStorage.setItem('channelsModalViewLoaded', "true");
         
	        var parameters = {
                            textInputClass: this.options.textInputClass,
                            modalBodyContent: this.options.modalBodyContent,
                            joinChannelId: this.options.joinChannelId,
                            modalHeaderContent: this.options.modalHeaderContent,
                            targetUsername: this.options.targetUsername,
			    targetUserId: this.options.targetUserId,
			    createChannelFromUserClass: this.options.createChannelFromUserClass,
			    createChannelClass: this.options.createChannelClass,
			    chooseExistingChannelClass: this.options.chooseExistingChannelClass,
			    createChannelSubmitClass: this.options.createChannelSubmitClass,
			    userChannelIdArray: this.options.userChannelIdArray,
			    userChannelNameArray: this.options.userChannelNameArray
                            };
                            
       var compiledTemplate = _.template( $("#channels_modal_template").html(), parameters);                     
       this.$el.html( compiledTemplate);
       
       $('.channels-modal').modal();
	 
            $('.channels-modal').on('hidden.bs.modal', function () {
		console.log('hidden channels modal handler');
		self.destroy();
	    });
	    
    },

    events: {
	
     "keyup .create-channel-from-users-name" : "channelNameChanging",
     "click #create-channel-from-users": "createChannelFromUsers",
     "click .show-create-channel-form": "showCreateChannelForm",
     "click .create-channel": "createChannel",
     "click .enter-channel": "enterChannel",
     "submit #create-channel-with-user-form" : "createChannel"
     
    },
    
        
    enterChannel: function(e) {
	
	console.log('enterchannel');
	     
	var requestedChannelId = $('.select-existing-channel option:selected').val();
	//var requestedChannelName = $(e.currentTarget).data('channel-name');

	$('.channels-modal').modal("hide");
	   
	var router = new Router();
	router.navigate("channels/" + requestedChannelId, {trigger: "true"}); 
	
      
    },
    
    showCreateChannelForm: function(e) {

	$('.select-existing-channel-div').addClass("hidden");
	$('#create-channel-with-user-form').removeClass("hidden");
	$('#create-channel').removeClass('enter-channel')
	.addClass('create-channel')
	.prop('disabled', true);
    	
    
    },
    
    channelNameChanging: function(e) {
	
	var channelNameLength = $(e.currentTarget).val().length;
        
        if (channelNameLength > 2) {
             $('#create-channel').prop('disabled', false);
        } else {
             $('#create-channel').prop('disabled', true);
        }
    },
    
    createChannel: function(e) {
                
        console.log('create channel');
        e.preventDefault();
        e.stopPropagation();
        
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");
	var myUserModel = localStorage.getItem("userModel");
       
        var channelName = $('.create-channel-from-users-name').val();
        
        socket.emit('create-channel', {
                                        name: channelName,
                                        createdByUserId: myUserId,
                                        createdByUsername: myUsername,
                                        targetUserId: "",
                                        targetUsername: "",
					createdByUserModel: myUserModel
                                        });
	
        //$('#create-channel-from-users').hide();
        //$('.modal').modal("toggle");
    },
    
    /*createChannelFromUsers: function(e) {
                
        console.log('create channel from users');
        e.preventDefault();
        e.stopPropagation();
        
        var targetUserId = $(e.currentTarget).data('target-user-id');
        var targetUsername = $(e.currentTarget).data('target-user-name'); 
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");
	var myUserModel = localStorage.getItem("userModel");
       
        var channelName = $('.create-channel-from-users-name[data-target-user-id="'+targetUserId+'"]').val();
        
        socket.emit('create-channel-and-invite-user-in', {
                                        name: channelName,
                                        createdByUserId: myUserId,
                                        createdByUsername: myUsername,
                                        targetUserId: targetUserId.toString(),
                                        targetUsername: targetUsername,
					createdByUserModel: myUserModel
                                        });
	
        $('#create-channel-from-users').hide();
        //$('.modal').modal("toggle");
    },
    
    joinedChannelAwaitOthers: function(data) {
     
        //localStorage.setItem('channelId', data.channelId);
        //localStorage.setItem('channelName', data.channelName);
          
         $('.create-channel-from-users-name').hide();
         $('.create-channel-from-users-result')
         .html('<strong>' + data.channelName + '</strong> created!<br><br>Now waiting for <strong>' + data.targetUsername + ' </strong>to accept')
         .append(' <i class="fa fa-refresh fa-spin channel-invitation-spinner" title="Loading..." aria-hidden="true" style="display: none"></i>')
         .show();
         
         $('.modal-title').hide();
         $('.channel-invitation-spinner').show();
         $('.create-channel-from-users').hide();
         
        
    },
    
    acceptChannelInvitation: function(e) {
        
        console.log("accept channel invitation");
        
        e.preventDefault();
        //e.stopPropagation();
        
        var invitedChannelId = $(e.currentTarget).data('join-channel-id');
        var myUsername = localStorage.getItem("username");
        var myUserId = localStorage.getItem("userId");
        var mySocketId = localStorage.getItem("socketId");
        
    },
    
    channelInvitationDeclined: function(data) {

	$('.create-channel-from-users-result').html('<strong>Sorry</strong>... ' + data.declinedByUsername + ' is currently busy.');
	
	setTimeout(function(){
	    $('.channels-modal').modal("hide");
	}, 3000);
    },*/
    
    channelReady: function(data) {
    
	var self = this;
	
	if(localStorage.getItem("channelName")) {
	    var channelNameArray = JSON.parse(localStorage.getItem("channelName"));
	} else {
	    var channelNameArray = [];
	}
	
	 channelNameArray.push(data.channelName.toString());
	 var uniqueChannelsArray = Array.from(new Set(channelNameArray));
	 
	 localStorage.setItem('channelName', JSON.stringify(uniqueChannelsArray));
	 
	if(localStorage.getItem("channelIds")) {
	    var channelIdArray = JSON.parse(localStorage.getItem("channelIds"));
	} else {
	    var channelIdArray = [];
	}
	
	 channelIdArray.push(data.channelId.toString());
	 var uniqueChannelIdsArray = Array.from(new Set(channelIdArray));
	 localStorage.setItem('channelIds', JSON.stringify(uniqueChannelIdsArray));
	 
	 
	 //localStorage.setItem("activeChannelName", data.channelName);
	 //localStorage.setItem("activeChannelId", data.channelId);
     
        console.log('channel ready');
	
         $('.channels-modal').modal("hide");
     
	var router = new Router();
	router.navigate("channels/" + data.channelId, {trigger: "true"});
	
    },
    
    destroy: function() { 
        
	console.log('channels modal remove funciont');
	
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('channelsModalViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});