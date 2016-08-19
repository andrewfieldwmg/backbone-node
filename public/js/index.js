$(document).on('ready', function() {

    if (typeof io === "undefined") {
        
        //console.log('websocket server not running');
        $('#socket_not_loaded').show();
               
    }
        
    if (!isWebkit) {
            
        $('#wrong_browser').show();
    
    }
    
    if (!initiateAudioContext) {
            
        $('#no_audiocontext').show();
    
    }
    
    if (typeof io !== "undefined" && isWebkit && initiateAudioContext) {
    
        socket = initSocketIo();
        
        localStorage.setItem('messageFormViewLoaded', "false");
        localStorage.setItem('messagesViewLoaded', "false");
        localStorage.setItem('appControlsViewLoaded', "false");
                
        if(localStorage.getItem("username")) {
     
                new ConnectedClientsView();
                //new MessageFormView();
                //new AppControlsView();
                //new MessagesView();
                
        } else {
                
                new UsernameFormView();
                
        }
    
    }
    
    $('body').tooltip({
        selector: '[data-toggle=tooltip]',
        'placement' : 'bottom'
    });
    

});


function initSocketIo() {

        var socket = io.connect({query: "username="+localStorage.getItem("username") + "&userId="+localStorage.getItem("userId") });
                
         socket.on('connect', function() {       
             console.log("Socket IO connected");
         });
         
         socket.on('socket-info', function(data) {
            
             var socketIndex = data.socketIndex;
              var socketId = data.socketId;
              var userId = data.userId;
              
             localStorage.setItem('socketIndex', socketIndex);
             localStorage.setItem('socketId', socketId);
             localStorage.setItem('userId', userId);
         });
         
         
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
        
        socket.on('connect_failed', function() {
            console.log('Connection Failed');
            
        });
    
 
    return socket;

}
