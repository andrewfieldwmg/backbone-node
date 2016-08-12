$(document).on('ready', function() {

    if (typeof io === "undefined") {
        
        //console.log('websocket server not running');
    
        $('#socket_not_loaded').show();
               
    }
        
    if (!isWebkit) {
            
        $('#wrong_browser').show();
    
    }
    
    if (typeof io !== "undefined" && isWebkit) {
    
        socket = initSocketIo();
    
        if(localStorage.getItem("username")) {
                new MainAppView({noSocket: false});
                
        } else {
                new UsernameFormView({noSocket: false});
        }
    
    }
    
    $('body').tooltip({
    selector: '[data-toggle=tooltip]',
    'placement' : 'bottom'
    });
    
});


function initSocketIo() {

        var socket = io.connect();
            
         socket.on('connect', function() {       
             console.log("Socket IO connected");
         });
         
         socket.on('socket-info', function(data) {
             var socketIndex = data.socketindex;
             
             localStorage.setItem('socketindex', socketIndex);
      
         });
         
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
            socket.on('connect_failed', function(){
            console.log('Connection Failed');
            
        });
    
 
        return socket;

    
}

 

var UsernameFormView = Backbone.View.extend({
    
    el: $("#username_form_container"),
    
    template : _.template( $("#username_form_template").html()),
           
    initialize: function(){

            this.render();
    },
    
    render: function(){
        
       this.$el.html( this.template );
        
    },

    events: {
   
     "click #submit-username": "submitUsername"
     
    },
    
    submitUsername: function(e) {
                
        console.log('submit username');
        e.preventDefault();
        var username = $('#username').val();
        
        socket.emit('username', { sender: tabID, username: username });
        
        localStorage.setItem('username', username);
         
         this.remove();   
         new MainAppView();
    }
    
   
});



var AudioPlayerView = Backbone.View.extend({
    
    el: $("#loaded-stream"),
           
    initialize: function(options){
            console.log('new audio player view');
            
            this.options = options;
            this.render();
            
            
    },
    
    render: function(){
        
       var parameters = {streamName : this.options.streamName}; 
       var compiledTemplate = _.template( $("#audio_player_template").html(), parameters);
       this.$el.html( compiledTemplate );
        
    },

    events: {
   
    }
   
});
       
      
      
var MainAppView = Backbone.View.extend({
    
    el: $("#main_app_container"),
           
    initialize: function(){
   
        
            var self = this;
                
             socket.on('message', function (data) {
                 self.socketMessageReceived(data);
             });
     
             socket.on("sent-file-incoming", function(data) {
                 self.socketFileIncoming(data);
             });
         
             socket.on("sent-file", function(data) {
                 self.socketFileReceived(data);
             });
                      
             socket.on("audio-file-incoming", function(data) {
                 self.socketAudioStreamIncoming(data); 
              });
             
             socket.on("stop-audio-stream", function(data) {
                 self.socketStopAudioStream(data); 
              });
         
            this.render();
        
        
    },
    
    render: function() {
             
        //new AudioPlayerView({streamName: "No stream loaded"});
        
        var parameters = {username: localStorage.getItem("username")};
        var compiledTemplate = _.template( $("#main_app_template").html(), parameters);
       this.$el.html( compiledTemplate );

    },

    events: {
   
    "click #submit-message": "submitMessage",
    "click #send-file": "openSendFile",
    "change #file": "sendFile",
    "click #start-file-stream": "openFileStream",
    "change #audio-file": "startFileStream",
    "click #start-recording": "startLiveStream",
    "click #listen" : "listenToStreams"
    
    },
    
    submitMessage: function(e) {
            
        console.log('submit message');
        e.preventDefault();
        var message = $('#message-text').val();
        
        socket.emit('message', { sender: tabID, username: localStorage.getItem("username"), message: message });
        
        $('#message-text').val("");
        
    
    },
    
     openSendFile: function(e) {
        
            $('#file').click();

    },
    
    sendFile: function(e) {
         
            var file = e.currentTarget.files[0];
             
            var stream = ss.createStream();
                 
            ss(socket).emit('file-upload', stream, { username: localStorage.getItem("username"), sender: tabID, username: localStorage.getItem("username"), size: file.size, name: file.name, type: file.type});
            ss.createBlobReadStream(file).pipe(stream);
            
            $('#message-results').append('<li class="list-group-item list-group-item-info"><strong>' + time + '</strong> Sending file: <strong>' + file.name + '</strong></li>');
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
             
        ss(socket).emit('audio-file', stream, { username: localStorage.getItem("username"), sender: tabID, size: file.size, name: file.name, type: file.type});
        ss.createBlobReadStream(file).pipe(stream);

        localStorage.setItem('', 'started');
        
        //$('#message-results').append('<li class="list-group-item list-group-item-info"><strong>' + time + '</strong> Broadcasting stream: <strong>' + file.name + '</strong></li>')

        //});
        
                $('#stop').on('click', function(e) {
             
                   console.log('stop clicked');
                   
                  e.stopPropagation();
             
                  socket.emit('stop-audio-stream');
                         
                  localStorage.setItem('streamState', 'stopped');
                                                
          
               });
    }, 

    socketMessageReceived: function(data) {
         
         console.log('message received');
         console.log('message received');
         
        var socketIndex = data.socketindex;
        var socketCss = getSocketCss(socketIndex);

        $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> Message from ' + data.username + ': <strong>' + data.message + '</strong></li>')
        
        scrollToBottom();
        playSound();

    },
    
    socketFileIncoming: function(data) {
        
            var socketIndex = data.socketindex;
            var socketCss = getSocketCss(socketIndex);
            
            $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> File transfer incoming from ' + data.username + ': <strong>' + data.name + '</strong> (loading...)</li>')
    
            scrollToBottom();
            playSound();
            
    },
    
    socketFileReceived: function(data) {
        
         console.log("receiving sent file");
         
           var socketIndex = data.socketindex;
            var socketCss = getSocketCss(socketIndex);
         
         $('#message-results').append('<li class="list-group-item ' + socketCss + '"><strong>' + time + '</strong> File transfer succesfully received from ' + data.username + ': <strong>' + data.name + '</strong></li>')
         
            var cleanURL = encodeURIComponent(data.name);

            $('#download-iframe').attr('src', '/api/download?file=' + cleanURL);
            
            scrollToBottom();
            playSound();
   
    },
    
    socketAudioStreamIncoming: function(data) {
        
        console.log('audio stream incoming');
        
        var socketIndex = data.socketindex;
        var socketCss = getSocketCss(socketIndex);
        var audioType = data.audioType;
        
        if (audioType === 'audio/wav') {
            //playPcmStream(socket);
             playMp3Stream(socket);
        } else if (audioType === 'audio/mp3') {
            playMp3Stream(socket);
        }
        
        
        //$('#listen').trigger('click');
    
            $('#message-results')
            .append('<li class="list-group-item ' + socketCss + '" data-stream-name="' + data.name + '"><strong>' + time + '</strong> Inbound stream loading from ' + data.username + ': <strong>' + data.name + '</strong></li>')
             
             new AudioPlayerView({streamName : data.name});
                    
            localStorage.setItem('streamState', 'started');
            
            scrollToBottom();
            //playSound();

    },
    
    startLiveStream: function(data) {
        
        console.log('start live stream backbone function clicked');
        
        startLiveStream(socket);

    },
    
    listenToStreams: function(data) {
        
        console.log('listen clicked');

        //audioStreamSocketIo(socket); 
 
        $.when(
               $('#stop').triggerHandler('click')
       ).done(function() {
                    playMp3Stream(socket);
                    //playMp3StreamWW(socket);
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

    }
    
 
      
});


            
$('#play-pcm').on('click', function(e) {
    console.log('play pcm clicked');
     
    socket.emit('play-pcm');
    playPcmStream(socket);
  
});


