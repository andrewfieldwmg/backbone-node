var AvailableChannelsView = Backbone.View.extend({
    
    el: $("#available_channels_container"),
    
    template : _.template( $("#available_channels_template").html()),
           
    initialize: function(){

            console.log('available channels init');
            
            var self = this;
            
            socket.on('available-channels', function(data) {
                self.availableChannelsUpdated(data);
            });
            
            socket.on('message-count-updated', function (data) {
                 self.socketMessageCountUpdated(data);
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
         
       localStorage.setItem('availableChannelsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeChannelName") != "") {
            
            $('#channels-list-header').html('Other Channels');
        }*/
        
    },

    events: {
   
      "click .enter-channel": "enterChannel"
     
    },
    
  
    availableChannelsUpdated: function(data) {

            var dataTable = $('.available-channels-table').DataTable();
	    dataTable.destroy();
	    
            $('#available-channels').html('');
            
            var availableChannels = JSON.parse(data.availableChannels);
                  
            console.log(availableChannels);
	    
                if (availableChannels.length === 0) {
                    
                    var channelMessage = "<strong>No channels</strong> available";
                        var parameters = {cssClass: "connected-client-list", time: time, contentFromUsername: channelMessage, contentName: "", loaderClass: "hidden" }; 
                        
                        var channelTableItemView = new ChannelTableItemView(parameters);
                        $('#available-channels').append(channelTableItemView.render());
  
                } else {
            
                    for(i = 0; i < availableChannels.length; i++) {
                    
                        var usersInChannel = JSON.parse(availableChannels[i].usersInChannel);
			 var numberUsersInChannel = usersInChannel.length;
			 
                        var index = usersInChannel.indexOf(localStorage.getItem("userId").toString());
                  
                        if (index > -1) {
                            usersInChannel.splice(index, 1);
                        }
                
                        var channelMessage = "<strong>" + availableChannels[i].name;
                        
                        if(numberUsersInChannel > 1) {
                            var linkClass = "enter-channel cursor-pointer";
                        } else {          
                            var linkClass = "disabled";
                        }
                        
                        if (availableChannels[i].name != localStorage.getItem("activeChannelName")) {
                        
                                    var parameters = {
					    linkClass: linkClass,
                                            channelId: availableChannels[i].id,
                                            channelName: availableChannels[i].name,
					    channelGenre: availableChannels[i].channelGenre,
					    numberChannelMembers: numberUsersInChannel,
                                            messageCount: availableChannels[i].messageCount
                                            };
                                            
                                            
                            var channelTableItemView = new ChannelTableItemView(parameters);
                            $('#available-channels').append(channelTableItemView.render());
                            
                        } else {
                            
                            var parameters = {
                           cssClass: "connected-client-list",
                           time: "",
                           linkClass: "disabled",
                           channelId: availableChannels[i].id,
                           channelName: availableChannels[i].name + " - <span class='small'><em>current channel</em></span>",
                           messageCount: availableChannels[i].messageCount
                           };
                                            
                                            
                            var channelTableItemView = new ChannelTableItemView(parameters);
                            $('#available-channels').append(channelTableItemView.render());
                            
                        }
 
                        
                    }
    
                    
            }

	$('.available-channels-table').DataTable({
	       responsive: true });
	     
    },
    
    socketMessageCountUpdated: function(data) {
        
        console.log('message count updated');
        
        $('.message-counter[data-channel-id="' + data.channelId + '"]').html(data.messageCount)
        .css('background-color', 'orange')
        .css('color', 'black')
        .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
        .attr('title', 'New Messages!');
    },
    
    enterChannel: function(e) {
	
	console.log('enterchannel');
	     
	var requestedChannelId = $(e.currentTarget).data('channel-id');
	var requestedChannelName = $(e.currentTarget).data('channel-name');

	var router = new Router();
	router.navigate("channels/" + requestedChannelId, {trigger: "true"}); 
	
      
    },
    
    remove: function() { 
          
        localStorage.setItem('availableChannelsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
      
    },
        
    destroy: function() {
        
	console.log('available channels destroy');
	
        socket.off('available-channels');
        socket.off('message-count-updated');
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
	//Backbone.View.prototype.remove.call(this);
	
	this.$el.empty();
    }
    
   
});