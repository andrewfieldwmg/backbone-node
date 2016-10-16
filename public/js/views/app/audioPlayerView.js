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


        /*streamTimeSlider = $('#ex1').slider();
        
	    streamTimeSlider.on('slideStop', function() {
		
	    var streamTime = streamTimeSlider.slider('getValue');
           
	   console.log(streamTime);
	   
	    /*socket.emit('set-volume', { newVolume: newVolume });
           
	    localStorage.setItem('streamVolume', newVolume);

        });*/
        
    },
  
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
        this.$el.empty().off();
	
        //this.stopListening();
	
	//$('.audio-player').css("display", "none");
        
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
	    streamImageSrc: this.options.streamImageSrc,
	    streamVolume : volumeToUse
	    };
	    
       var compiledTemplate = _.template( $("#audio_player_template").html(), parameters);
       this.$el.html( compiledTemplate );
  
	//this.$el.addClass('marginbottom45');
	
	//var audioPlayerDisplay = $(".audio-player").css("display");
	
	    $('.audio-player').addClass("bounceInUp");
	
	    if(localStorage.getItem("audioPlayerSliddenUp") == "false") {
		
		//$('.audio-player').css("display", "block");
		/*$('.audio-player').slideUp("slow", function() {
		    $(this).css("display", "block");
		});*/
		
		localStorage.setItem("audioPlayerSliddenUp", "true");
	    }
	    
	            
	/*$(".waveform-image-scroll").resizable();
	
	var waveformContainerWidth = $('.player-waveform').css('width');
	
	$(".waveform-image-scroll").resizable( "option", "maxWidth", waveformContainerWidth );
	
	    $(".waveform-image-scroll").on( "resize", function(event, ui) {
		
		var parent = ui.element.parent();

		var roundedNewWidth = Math.floor(ui.element.width() / parent.width());
		var roundedNewWidthPercent = roundedNewWidth + "%";
		console.log(roundedNewWidthPercent);
		
	    });*/
	    
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
     