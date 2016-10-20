$(document).on('ready', function() {

    if (typeof io === "undefined") {
        
        console.log('websocket server not running');
        $('#socket_not_loaded').show();
        return;       
    }
        
    if (!isWebkit || isMobileOrTablet()) {
            
        //$('#wrong_browser').show();
        //return;
    }
    
    if (!checkAudioContext) {
            
        $('#no_audiocontext').show();
        return;
    }
    
    //if (typeof io !== "undefined" && isWebkit && !isMobileOrTablet() && initiateAudioContext) {
    
     if (typeof io !== "undefined" && checkAudioContext) {
     
        socket = initSocketIo();

        //localStorage.clear();
        
        //LOCAL STORAGES BELOW
        
        //APP
        localStorage.setItem("appControlsViewLoaded", "false");
        
        //AUDIO
        localStorage.setItem("streamState", "stopped");
        localStorage.setItem("playMp3FunctionLoaded", "false");
        localStorage.setItem("streamVolume", "1");
        localStorage.setItem("userRole", "");
        localStorage.setItem("audioPlayerSliddenUp", "false");
           
        //USERS
        localStorage.setItem('connectedClientsViewLoaded', "false");
        localStorage.setItem('contactsViewLoaded', "false");
        localStorage.setItem("clientsInChannelViewLoaded", "false");
        
        //CHANNEL
        localStorage.setItem("availableChannelsViewLoaded", "false");
        localStorage.setItem("userChannelsViewLoaded", "false");
        
        //MESSAGES
        localStorage.setItem("messageFormViewLoaded", "false");
        localStorage.setItem("messagesViewLoaded", "false");
    
        //STREAMS
        localStorage.setItem('availableStreamsViewLoaded', "false");
        localStorage.setItem('featuredStreamsViewLoaded', "false");
          
        //MODALS
        localStorage.setItem("userActionsModalViewLoaded", "false");
        localStorage.setItem("channelsModalViewLoaded", "false");
        localStorage.setItem("acceptInvitationViewLoaded", "false");
        
        //CONTROLLERS
	localStorage.setItem("audioControllerLoaded", "false");
        
        //ROUTING
        var router = new Router();
        Backbone.history.start({pushState: true});
        
        $(document).on("click", "a:not([data-bypass])", function(evt) {
            var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
            var root = location.protocol + "//" + location.host + Backbone.history.options.root;
          
            if (href.prop && href.prop.slice(0, root.length) === root) {
              evt.preventDefault();
              Backbone.history.navigate(href.attr, true);
            }
        });
        
        //WEB AUDIO API 
        initiateAudioContext();
    
    }
    
});


function initSocketIo() {

        var queryString = "username="+localStorage.getItem("username") +
                                "&userId="+localStorage.getItem("userId");
                                
                                
        var socket = io.connect({query: queryString});
                
         socket.on('connect', function() {       
             console.log("Socket IO connected");
         });
         
         socket.on('socket-info', function(data) {
            
            localStorage.setItem('socketId', data.socketId);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userEmail", data.userEmail);
            localStorage.setItem("userGenre", data.userGenre);
            localStorage.setItem("userColour", data.userColour);
            localStorage.setItem("userLocation", data.userLocation);
            localStorage.setItem("channelIds", data.inChannels);
  
         });
         
                                                    
         /*socket.on('socket-model', function(data) {
            var userModel = data.userModel;
            localStorage.setItem('userModel', userModel);
         });*/
         
         
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
        
        socket.on('connect_failed', function() {
            console.log('Connection Failed');  
        });
    

    return socket;

}