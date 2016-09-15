var FeaturedStreamsView = Backbone.View.extend({
    
    el: $("#featured_streams_container"),
    
    template : _.template( $("#featured_streams_template").html()),
           
    initialize: function(){

            console.log('featured streams init');
            
            var self = this;
            
            socket.on('available-streams', function(data) {
                self.featuredStreamsUpdated(data);
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
         
       localStorage.setItem('featuredStreamsViewLoaded', "true");
       this.$el.html( this.template );
                 
        /*if (localStorage.getItem("activeRoomName") != "") {
            
            $('#rooms-list-header').html('Other Rooms');
        }*/
        
    },

    events: {
   
      "click .enter-room": "enterRoom"
     
    },
    
  
    featuredStreamsUpdated: function(data) {

            var streamsDataTable = $('.featured-streams-table').DataTable();
	    streamsDataTable.destroy();

            var availableStreams = JSON.parse(data.availableStreams);
                  
            //console.log(featuredStreams);
	    
                if (availableStreams.length === 0) {
                    
                    //var roomMessage = "<strong>No rooms</strong> featured";
                        //var parameters = {cssClass: "connected-client-list", time: time, contentFromUsername: roomMessage, contentName: "", loaderClass: "hidden" }; 
                        
                        //var streamTableItemView = new StreamTableItemView(parameters);
                        //$('#featured-streams').append(streamTableItemView.render());
  
                } else {
            	    
                    $('#featured-streams').html('');
                    
                    $('.featured-streams-table-head').show();
            
                    for(i = 0; i < availableStreams.length; i++) {
                    
                        /*var usersInRoom = JSON.parse(featuredStreams[i].usersInRoom);
			 var numberUsersInRoom = usersInRoom.length;
			 
                        var index = usersInRoom.indexOf(localStorage.getItem("userId").toString());
                  
                        if (index > -1) {
                            usersInRoom.splice(index, 1);
                        }*/
                
                        if (availableStreams[i].state === 'offline') {
        

                                var parameters = {
                                        streamId: availableStreams[i].id,
                                        streamName: availableStreams[i].filename,
                                        streamGenre: availableStreams[i].genre,
                                        profileImageSrc: config.filePaths.userProfileImageDir + "/" + availableStreams[i].streamedByUserId + "_profile.jpg", 
                                        streamedByUsername: availableStreams[i].streamedByUsername,
                                        upvotes: availableStreams[i].upvotes,
                                        createdAt: availableStreams[i].createdAt,
                                        roomId: availableStreams[i].roomId,
                                        roomName: availableStreams[i].roomName,
                                        listenButtonClass: "listen-to-featured-stream"
                                        };
                                                    
                                                    
                                    var streamTableItemView = new StreamTableItemView(parameters);
                                    $('#featured-streams').append(streamTableItemView.render());
                       }
                        
                    }
                        
                            $('.featured-streams-table').DataTable({
                                   responsive: true,
                                   "pageLength": 5,
                                   "order": [[ 0, "desc" ]]
                                   });
                                 
                    
            }

    },
    
    socketMessageCountUpdated: function(data) {
        
        console.log('message count updated');
        
        $('.message-counter[data-room-id="' + data.roomId + '"]').html(data.messageCount)
        .css('background-color', 'orange')
        .css('color', 'black')
        .animate({ 'zoom': 1.3 }, 100).animate({ 'zoom': 1.0 }, 100)
        .attr('title', 'New Messages!');
    },
    
    enterRoom: function(e) {
	
	console.log('enterroom');
	     
	var requestedRoomId = $(e.currentTarget).data('room-id');
	var requestedRoomName = $(e.currentTarget).data('room-name');

	var router = new Router();
	router.navigate("rooms/" + requestedRoomId, {trigger: "true"}); 
	
      
    },
    
    remove: function() { 
          
        localStorage.setItem('featuredStreamsViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        
        //this.remove();
      
    },
        
    destroy: function() {
        
	console.log('featured streams destroy');
	
        socket.off('featured-streams');
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