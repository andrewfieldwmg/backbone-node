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
    
    if (typeof io !== "undefined" && isWebkit  && !isMobileOrTablet() && initiateAudioContext) {
    
        socket = initSocketIo();

        //localStorage.clear();
        
        localStorage.setItem("roomsViewLoaded", "false");
        localStorage.setItem("roomsModalViewLoaded", "false");
        localStorage.setItem("acceptInvitationViewLoaded", "false");         
        localStorage.setItem("messageFormViewLoaded", "false");
        localStorage.setItem("messagesViewLoaded", "false");
        localStorage.setItem("appControlsViewLoaded", "false");
        localStorage.setItem("clientsInRoomViewLoaded", "false");
        localStorage.setItem("streamState", "stopped");
             
        var router = new Router();
        Backbone.history.start({pushState: true});

    }
    
    $('body').tooltip({
        selector: '[data-toggle=tooltip]',
        'placement' : 'bottom'
    });
    

});


function initSocketIo() {

        var queryString = "username="+localStorage.getItem("username") +
                                "&userId="+localStorage.getItem("userId") +
                                "&roomIds="+localStorage.getItem("roomIds") +
                                "&roomName="+localStorage.getItem("roomName") +
                                "&userColour="+localStorage.getItem("userColour");
                                
        var socket = io.connect({query: queryString});
                
         socket.on('connect', function() {       
             console.log("Socket IO connected");
         });
         
         socket.on('socket-info', function(data) {
            
            var socketIndex = data.socketIndex;
            var socketId = data.socketId;
            var userId = data.userId;
            var userColour = data.userColour;
             
            localStorage.setItem('socketIndex', socketIndex);
            localStorage.setItem('socketId', socketId);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userColour', userColour);
            
         });
         
         
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
        
        socket.on('connect_failed', function() {
            console.log('Connection Failed');  
        });
    
 
    return socket;

}