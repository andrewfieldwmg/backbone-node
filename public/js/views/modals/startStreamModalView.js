var StartStreamModalView = Backbone.View.extend({
    
    el: $("#start_stream_modal_container"),
    
    template : _.template( $("#start_stream_modal_template").html()),
           
    initialize: function(options){
        
        var self = this;
        
        this.options = options;
	this.myUserId = localStorage.getItem("userId");
            
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
	
        localStorage.setItem('startStreamModalViewLoaded', "true");

            parameters = {
                        fileInputClass: this.options.fileInputClass,
                        buttonClass: this.options.buttonClass
                        };
            
       var compiledTemplate = _.template( $("#start_stream_modal_template").html(), parameters);                     
       this.$el.html( compiledTemplate);
       
       $('.start-stream-modal').modal();
       
            $('.start-stream-modal').on('hidden.bs.modal', function () {
		self.destroy();
	    });
	    
         $('.start-stream-button').prop('disabled', true);
    },

    events: {
        
    "keyup .stream-genre" : "streamGenreChanging",
     "click .start-file-stream": "startFileStream",
     "click .start-live-stream": "startLiveStream"
     //"submit #create-channel-with-user-form" : "createChannelFromUsers"
     
    },
    
        
    streamGenreChanging: function(e) {
    
        var genreLength = $('.stream-genre').val().length;
          
        if (genreLength > 2) {
             $('.start-stream-button').prop('disabled', false);
        } else {
             $('.start-stream-button').prop('disabled', true);
        }
        
    },
    
    startFileStream: function(e) {
        
        console.log('audio file changed');
            
        //$.when(
        
               //$('#stop').triggerHandler('click')
               
        //).done(function() {
   
               //audioStreamSocketIo(socket);
         
        var file = $('#audio-file')[0].files[0];
         var genre = $('.stream-genre').val();
         
        var stream = ss.createStream();
             
        ss(socket).emit('audio-file',
                            stream,
                                {
                                userId: localStorage.getItem("userId"),
                                username: localStorage.getItem("username"),
                                activeChannelId: localStorage.getItem("activeChannelId"),
                                activeChannelName: localStorage.getItem("activeChannelName"),
                                userColour: localStorage.getItem("userColour"),
                                liveStream: "false",
                                sender: tabID,
                                size: file.size,
                                name: file.name,
                                type: file.type,
                                genre: genre
                                });
            
        ss.createBlobReadStream(file).pipe(stream);

        localStorage.setItem('streamState', '');
	
        localStorage.setItem('userRole', 'streamer');
    
        var cssClass = "list-item-" + localStorage.getItem("userColour");
        
        var parameters = {
                cssClass: cssClass,
                backgroundColour: localStorage.getItem("userColour"),
                time: time,
                contentFromUsername: "Broadcasting file stream",
                contentName: file.name,
                loaderClass: "hidden"
                };
        
        var listItemView = new ListItemView(parameters);
        
        $('#message-results').append(listItemView.render());
    
        //});
        
                $('#stop-all-audio').on('click', function(e) {
             
                   console.log('stop clicked');
                   
                  e.stopPropagation();
             
                    socket.emit('stop-audio-stream', {
                        userRole: localStorage.getItem("userRole"),
                        activeChannelId: localStorage.getItem("activeChannelId")
                    });
                         
                  localStorage.setItem('streamState', 'stopped');
		  
		    var audioPlayer = new AudioPlayerView({streamName : "" });
                    audioPlayer.destroy();
                                                
               });
                
    },
    
    startLiveStream: function(data) {
        
        //console.log('start live stream backbone function clicked');
        var cssClass = "list-item-" + localStorage.getItem("userColour");
    
        var parameters = {
                        cssClass: cssClass,
                        backgroundColour: localStorage.getItem("userColour"),
                        time: time,
                        contentFromUsername: "Broadcasting live stream",
                        contentName: "",
                        loaderClass: "hidden"
                        };
        
        var listItemView = new ListItemView(parameters);
        
        $('#message-results').append(listItemView.render());

        
        scrollToBottom();
        startLiveStream(socket);

    },
    
    destroy: function() { 
        
	//$('.invitation-modal').modal("hide");
	
        localStorage.setItem('startStreamModalViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});