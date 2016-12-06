var UserChannelsView = Backbone.View.extend({
    
    el: $("#user_channels_container"),
    
    template : _.template( $("#user_channels_template").html()),
           
    initialize: function(){

            //console.log('channels view init');

        
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
        
	socket.off('user-channels');
        socket.off('message-count-updated');
	
        this.undelegateEvents();
	this.$el.removeData().unbind();
        this.$el.empty();
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
         
       localStorage.setItem('userChannelsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeChannelName") != "") {
            
            $('#channels-list-header').html('Other Channels');
        }*/
                    
            var self = this;
            
            socket.on('user-channels', function(data) {
                self.availableChannelsUpdated(data);
            });
            
            socket.on('message-count-updated', function (data) {
                 self.socketMessageCountUpdated(data);
             });
    },

    events: {
   
     "click .create-channel": "openCreateChannelForm",
     "click .enter-channel": "enterChannel"
     
    },
    
    enterChannel: function(e) {
	
	//console.log('enterchannel');
	     
	var requestedChannelId = $(e.currentTarget).data('channel-id');
	var requestedChannelName = $(e.currentTarget).data('channel-name');

	var router = new Router();
	router.navigate("channels/" + requestedChannelId, {trigger: "true"}); 
	
      
    },
    
    openCreateChannelForm: function(e) {
        
        //var channelsFormView = new ChannelsFormView();
        //channelsFormView.render();
        	
	if (localStorage.getItem("channelsModalViewLoaded") == "false") {
        
	    //console.log('channels modal view NOT loaded, so proceeding');
        	
	    //console.log('open channel modal');
        
	if(localStorage.getItem("userChannelIds")) {
	    var chooseExistingChannelClass = "";
	    var createChannelClass = "hidden";
	    var createChannelSubmitClass = "enter-channel";
	    var userChannelIdArray = JSON.parse(localStorage.getItem("userChannelIds"));
	    var userChannelNameArray = JSON.parse(localStorage.getItem("userChannelNames"));
	    var modalHeaderContent = "Choose a <strong>Stream Channel</strong>";
	} else {
	    var chooseExistingChannelClass = "hidden";
	    var createChannelClass = "";
	    var createChannelSubmitClass = "create-channel";
	    var userChannelIdArray = null;
	    var userChannelNameArray = null;
	    var modalHeaderContent = "Create a <strong>Stream Channel</strong>";
	}
	
	    var parameters = {
			    modalHeaderContent: modalHeaderContent,
			    targetUsername: "",
			    targetUserId: "",
                            createChannelFromUserClass: "hidden",
			    createChannelClass: createChannelClass,
			    chooseExistingChannelClass: chooseExistingChannelClass,
			    createChannelSubmitClass: createChannelSubmitClass,
			    userChannelIdArray: userChannelIdArray,
			    userChannelNameArray: userChannelNameArray
                            };
				
	    var channelsModalView = new ChannelsModalView(parameters);
	    channelsModalView.afterRender();
            
        } else {
            
            console.log('channels modal view ALREADY loaded');
            
        }
        
    },
    
  
    availableChannelsUpdated: function(data) {

                  
                if (data.availableChannels == null) {
                    
		    $('.loading-channels-li').html('No channels found');
		    
                } else {
                    
		    var availableChannels = JSON.parse(data.availableChannels);
			 
		    $('#user-channels').html('');
		
                    for(i = 0; i < availableChannels.length; i++) {
                    
                        var usersInChannel = JSON.parse(availableChannels[i].usersInChannel);
                        var index = usersInChannel.indexOf(localStorage.getItem("userId").toString());
                  
                        if (index > -1) {
                            usersInChannel.splice(index, 1);
                        }

                        var numberUsersInChannel = usersInChannel.length;
                        
                        var channelMessage = "<strong>" + availableChannels[i].name;
                        
                        if(numberUsersInChannel > 1) {
                            var linkClass = "enter-channel cursor-pointer";
                        } else {          
                            var linkClass = "disabled";
                        }
                        
                        if (availableChannels[i].name != localStorage.getItem("activeChannelName")) {
                        
                                    var parameters = {
                                            cssClass: "connected-client-list",
                                            time: "",
                                            linkClass: "enter-channel cursor-pointer",
                                            channelId: availableChannels[i].id,
                                            channelName: availableChannels[i].name,
                                            messageCount: availableChannels[i].messageCount
                                            };
                                            
                                            
                            var channelListItemView = new ChannelListItemView(parameters);
                            $('#user-channels').append(channelListItemView.render());
                            
                        } else {
                            
                            var parameters = {
                           cssClass: "connected-client-list",
                           time: "",
                           linkClass: "disabled",
                           channelId: availableChannels[i].id,
                           channelName: availableChannels[i].name + " - <span class='small'><em>current channel</em></span>",
                           messageCount: availableChannels[i].messageCount
                           };
                                            
                                            
                            var channelListItemView = new ChannelListItemView(parameters);
                            $('#user-channels').append(channelListItemView.render());
                            
                        }
 
                        
                    }
    
                    
            }

    },
    
    socketMessageCountUpdated: function(data) {
        
        //console.log('message count updated');
        
        $('.message-counter[data-channel-id="' + data.channelId + '"]').html(data.messageCount)
        .css('background-color', 'orange')
        .css('color', 'black')
        .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
        .attr('title', 'New Messages!');
    },
    
    remove: function() { 
          
        localStorage.setItem('userChannelsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
      
    },
        
    destroy: function() {
        
        socket.off('user-channels');
        socket.off('message-count-updated');
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        this.remove();
    }
    
   
});