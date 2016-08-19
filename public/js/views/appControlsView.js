var AppControlsView = Backbone.View.extend({
    
    el: $("#app_controls_container"),
    
    template : _.template( $("#app_controls_template").html()),
           
    initialize: function(){
        
            var self = this;
            
             socket.on("stop-audio-stream", function(data) {
                 self.socketStopAudioStream(data); 
              });          
             
            //this.render();
            
    },
    
    render: function(){
        
        localStorage.setItem("appControlsViewLoaded", "true");
        this.$el.html( this.template );
        
    },

    events: {
        
        "click #start-recording": "startLiveStream",
        "click #start-file-stream": "openFileStream",
        "change #audio-file": "startFileStream",
        "click #send-file": "openSendFile",
        "change #file": "sendFile",
        "click #listen" : "listenToStreams"
     
    },
    
    startLiveStream: function(data) {
        
        console.log('start live stream backbone function clicked');
    
        var parameters = {
                        cssClass: "list-group-item-info",
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
    
    openFileStream: function(e) {
        
        console.log('open file stream');
        
        $.when(
               $('#stop').triggerHandler('click')
        ).done(function() {
                $('#audio-file').click();
        });   
 
    },
    
    startFileStream: function(e) {
        
        console.log('audio file changed');
            
        //$.when(
        
               //$('#stop').triggerHandler('click')
               
        //).done(function() {
   
               //audioStreamSocketIo(socket);
         
        var file = e.currentTarget.files[0];
         
        var stream = ss.createStream();
             
        ss(socket).emit('audio-file', stream, { liveStream: "false", username: localStorage.getItem("username"), sender: tabID, size: file.size, name: file.name, type: file.type});
        ss.createBlobReadStream(file).pipe(stream);

        localStorage.setItem('streamState', '');
        
        var parameters = {
                cssClass: "list-group-item-info",
                time: time,
                contentFromUsername: "Broadcasting file stream",
                contentName: file.name,
                loaderClass: "hidden"
                };
        
        var listItemView = new ListItemView(parameters);
        
        $('#message-results').append(listItemView.render());
    
        //});
        
                $('#stop').on('click', function(e) {
             
                   console.log('stop clicked');
                   
                  e.stopPropagation();
             
                  socket.emit('stop-audio-stream');
                         
                  localStorage.setItem('streamState', 'stopped');
                                                
               });
                
    },
    
    openSendFile: function(e) {
        
            $('#file').click();

    },
    
    sendFile: function(e) {
         
            var file = e.currentTarget.files[0];
             
            var stream = ss.createStream();
                 
            ss(socket).emit('file-upload', stream, { username: localStorage.getItem("username"), sender: tabID, username: localStorage.getItem("username"), size: file.size, name: file.name, type: file.type});
            ss.createBlobReadStream(file).pipe(stream);
            
            var parameters = {
                cssClass: "list-group-item-info",
                time: time,
                contentFromUsername: "Transferring file: ",
                contentName: file.name,
                loaderClass: ""
                };
        
            var listItemView = new ListItemView(parameters);
            
            $('#message-results').append(listItemView.render());
        
            
    },
    

    listenToStreams: function(data) {
        
        console.log('listen clicked');

        //audioStreamSocketIo(socket); 
 
        $.when(
               $('#stop').triggerHandler('click')
       ).done(function() {
                    playMp3Stream(socket);
                    new AudioPlayerView({streamName : "Loading Live Stream..."});
        });
    },
    
         
    socketStopAudioStream: function(data) {
     
        console.log('socket received from server: stop audio stream');
        
         if(localStorage.getItem("streamState") !== "stopped") {
            
             $('#stop').trigger('click');
                    console.log('stream state started, so triggered stop button');
             } else {
                    console.log('stream state already stopped, so didnt trigger stop button');
             }
         
        /*localStorage.setItem('streamState', 'stopped');
                                      
           audioContext.close().then(function() {
             
               console.log('close promise resolved');
               $('#message-results').append('<li class="list-group-item">Inbound stream stopped</li>')
    
           });*/

    },

    
    remove: function() {
        
        localStorage.setItem("appControlsViewLoaded", "false");
        
        socket.off("stop-audio-stream");
           
        this.$el.empty().off(); 
        this.stopListening();
    },
    
    hide: function() {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.hide(); 
        //Backbone.View.prototype.remove.call(this);

    },
        
    show: function() {

        // COMPLETELY UNBIND THE VIEW
        //this.undelegateEvents();
    
        //this.$el.removeData().unbind(); 
    
        // Remove view from DOM
        this.$el.show();  
        //Backbone.View.prototype.remove.call(this);

    }
      
   
});
