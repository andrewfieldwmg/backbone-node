$(document).on('ready', function() {

    if (typeof io === "undefined") {
        
        console.log('websocket server not running');
        $('#socket_not_loaded').show();
        return;       
    }
        
    if (!isWebkit || isMobileOrTablet()) {
            
        $('#wrong_browser').show();
        return;
    }
    
    if (!initiateAudioContext) {
            
        $('#no_audiocontext').show();
        return;
    }
    
    if (typeof io !== "undefined" && isWebkit && !isMobileOrTablet() && initiateAudioContext) {
    
        socket = initSocketIo();

        //localStorage.clear();
        
        //APP
        localStorage.setItem("appControlsViewLoaded", "false");
        localStorage.setItem("streamState", "stopped");
        
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
             
        var router = new Router();
        Backbone.history.start({pushState: true});

    }
    
    $('body').tooltip({
        selector: '[data-toggle=tooltip]',
        'placement' : 'bottom'
    });
    
    	    
      	    
	/*$(document).on('click', '[data-dismiss="modal"]', function(){
	   $('.modal').hide(); // hide the modal 
	//$('#modal-dynamic-content').empty(); // empties dynamic content
	   $('.modal-backdrop').remove(); // removes all modal-backdrops
	});*/
});


function initSocketIo() {

        var queryString = "username="+localStorage.getItem("username") +
                                "&userId="+localStorage.getItem("userId") +
                                "&channelIds="+localStorage.getItem("channelIds") +
                                "&channelName="+localStorage.getItem("channelName") +
                                "&userColour="+localStorage.getItem("userColour");
                                
        var socket = io.connect({query: queryString});
                
         socket.on('connect', function() {       
             console.log("Socket IO connected");
         });
         
         socket.on('socket-info', function(data) {
            
            var socketId = data.socketId;
            var userId = data.userId;
            var userColour = data.userColour;
             
            localStorage.setItem('socketId', socketId);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userColour', userColour);
 
         });
         
                  
         socket.on('socket-model', function(data) {
            
            var userModel = data.userModel;
            localStorage.setItem('userModel', userModel);
            
         });
         
         
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
        
        socket.on('connect_failed', function() {
            console.log('Connection Failed');  
        });
    
 
    return socket;

}