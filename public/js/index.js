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
    
        if(localStorage.getItem("username")) {
            
                new MessageFormView();
                new AppControlsView();
                new ConnectedClientsView();
                new MessagesView();
                
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

        var socket = io.connect({query: "username="+localStorage.getItem("username")});
                
         socket.on('connect', function() {       
             console.log("Socket IO connected");
         });
         
         socket.on('socket-info', function(data) {
            
             var socketIndex = data.socketIndex;
              var socketId = data.socketId;
              
             localStorage.setItem('socketIndex', socketIndex);
             localStorage.setItem('socketId', socketId);
         });
         
         
         socket.on('disconnect', function(){
            console.log('SocketIO connection to the server terminated');    
         });
        
        
        socket.on('connect_failed', function() {
            console.log('Connection Failed');
            
        });
    
 
    return socket;

}
