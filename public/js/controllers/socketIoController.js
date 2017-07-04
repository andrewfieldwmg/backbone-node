var socketIoWorker = new Worker("/js/webWorkers/socketIoWorker.js")

var audioController = new AudioController;
var userControlsView = new UserControlsView;

socketIoWorker.onmessage = function(e) {

      var messageType = e.data.type;
      
      var messageData = e.data.data;
      
      if (messageType == 'audio-file-incoming') {
          audioController.socketAudioStreamIncoming(messageData); 
      }
      
}


socketIoWorker.onmessage = function(e) {

    var messageType = e.data.type;
    
    var messageData = e.data.data;
    
    switch(messageType) {
        
        case "channel-ready":
            userControlsView.channelReady(messageData);
            break;
        case "user-channels":
            //self.updateMessageHistory(messageData);
            break;
        case "private-message-count":
            userControlsView.updatePrivateMessageCount(messageData);
            break;

    }

    
 }