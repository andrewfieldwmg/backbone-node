var AudioPlayerView = Backbone.View.extend({
    
    el: $("#audio_player_container"),
           
    initialize: function(options){
        
            console.log('new audio player view');
            
        var audioContext = this.options.audioContext;
            
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
        
        var parameters = {streamName : this.options.streamName, streamVolume : volumeToUse}; 
       var compiledTemplate = _.template( $("#audio_player_template").html(), parameters);
       this.$el.html( compiledTemplate );
        
	this.$el.addClass('marginbottom45');
    },

    events: {
   
    }
   
});
     