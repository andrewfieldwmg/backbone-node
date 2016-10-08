var AudioPlayerView = Backbone.View.extend({
    
    el: $("#audio_player_container"),
           
    initialize: function(options){
        
            console.log('new audio player view');
            
        //var audioContext = this.options.audioContext;
            
              this.render = _.wrap(this.render, function(render) {
                       this.beforeRender();
                       render();						
                       this.afterRender();
               });						
                   

        this.render();
        
        var volumeSlider = $('#ex1').slider();
        
        volumeSlider.on('slideStop', function() {
           var newVolume = volumeSlider.slider('getValue');
           
           socket.emit('set-volume', { newVolume: newVolume });
           
           localStorage.setItem('streamVolume', newVolume);
           
        });
        
    },
  
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
        this.$el.empty().off(); 
        //this.stopListening();
        
    },
    
    
    afterRender: function() {
                                    
        if(localStorage.getItem("streamVolume")) {
          var volumeToUse = localStorage.getItem("streamVolume");
        } else {
          var volumeToUse = 1;
        }
        
        var parameters = {
	    streamName : this.options.streamName,
	    streamId: this.options.streamId,
	    userId: this.options.userId,
	    username: this.options.username,
	    profileImageSrc: this.options.profileImageSrc,
	    streamVolume : volumeToUse
	    };
	    
       var compiledTemplate = _.template( $("#audio_player_template").html(), parameters);
       this.$el.html( compiledTemplate );
        
	this.$el.addClass('marginbottom45');
    },

    events: {
	
	"click .upvote-stream": "upvoteStream"
    },
    
    upvoteStream: function(e) {
	
	var streamId = $(e.currentTarget).data("stream-id");
	var streamerUserId = $(e.currentTarget).data("user-id")
	
	var parameters = {
	    voterUserId: localStorage.getItem("userId"),
	    streamerUserId: streamerUserId,
	    streamId: streamId,
	    channelId: localStorage.getItem("activeChannelId")
	};
	
	
	socket.emit("upvote-stream", parameters);
	
	$('.upvote-stream').animate({opacity: "1.0"}, 'fast')
	.attr('title', 'Thanks for the love!')
	.tooltip('enable')
	.tooltip({trigger: 'manual'})
	.tooltip('show');
	    
	    setTimeout(function() {
		$('.upvote-stream').animate({opacity: "0.6"}, 'fast').tooltip('hide').tooltip('disable');
	      }, 1500 ); 
    },
    
    destroy: function() {
	
	this.undelegateEvents();
	this.$el.removeData().unbind();
        
        this.$el.empty().off();
	
    }
   
});
     