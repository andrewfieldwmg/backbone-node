//SERVER BASICS
var express = require('express');
var server = express();
var ip = require("ip");
var cluster = require('cluster');

//AUDIO
//var wav = require('node-wav');
//var lame = require('lame');
//var sox = require('sox');
//var soxStream = require('sox-stream')

var SoxCommand = require('sox-audio');

//var ogg = require('ogg');
//var wavArrayBuffer = require('wav-arraybuffer');
//var wavHeader = require("waveheader");
//var ffmpegTranscoder = require('stream-transcoder');
//var piedPiper = require('pied-piper');
//var im = require('imagemagick');

// FILE SYSTEM and STREAMS
var fs = require('fs');
var path = require("path");
var mime = require('mime');
var sanitize = require("sanitize-filename");

//var chokidar = require('chokidar');
//var growingFile = require('growing-file');
//var tailingStream = require('tailing-stream');

function getExtension(filename) {
    return filename.split('.').pop();
}

//SOCKET IO
var socketio_app = server.listen(8080);
var io = require('socket.io')(socketio_app);
var ss = require('socket.io-stream');

//DIRS (to do: add these to a config.json)

var uploadFolder = "/uploads";
var upload_dir = path.join(__dirname, '../', 'public' + uploadFolder);  
var audioPath = path.join(upload_dir + '/audio');

var wavRecordingFilename = 'liveStream.wav';
var mp3RecordingFilename = 'liveStream.mp3';

var wavRecordingFile = audioPath + '/' + wavRecordingFilename;
var mp3RecordingFile = audioPath + '/' + mp3RecordingFilename;


    function deleteFromArray(my_array, element) {
      position = my_array.indexOf(element);
      my_array.splice(position, 1);
    }
    
    
    var connectedSocketIds = [];
    var connectedUsernames = [];
    
    io.sockets.on('connection', function (socket) {
               
        connectedSocketIds.push(socket.id);
    
        var handshake = socket.handshake;
        var username = handshake.query.username;
        
        if(username !== "null") {
              connectedUsernames.push(username);
        }
               
        socket.on('new-username', function (data) {
            console.log(connectedSocketIds);
            connectedUsernames.push(data.username);
            var uniqueUsernameArray = Array.from(new Set(connectedUsernames));     
            io.sockets.emit('connected-clients', {connectedSocketIds: JSON.stringify(connectedSocketIds), connectedUsernames: JSON.stringify(uniqueUsernameArray) });      
        });
    
         var uniqueUsernameArray = Array.from(new Set(connectedUsernames));
         
        var clientIp = socket.request.connection.remoteAddress;
     
        var socketIndex = connectedSocketIds.indexOf(socket.id);
            
            //SEND SOCKET INFO BACK TO THE NEW JOINER//
            socket.emit('socket-info', { socketIndex: socketIndex, socketId: socket.id });
     
            //SEND UPDATED LIST OF ALL SOCKETS TO ALL//
            io.sockets.emit('connected-clients', {connectedSocketIds: JSON.stringify(connectedSocketIds), connectedUsernames: JSON.stringify(uniqueUsernameArray) });
            
            socket.on('set-volume', function (data) {
               socket.emit('set-volume', { newVolume: data.newVolume}); 
            });
            
            
            console.log('SocketIO client connected: ' + socket.id);
                 
             socket.on('message', function (data) {
                
                 console.log('Received a message!' + data.message);
                 
                 var message = data.message;
                 var sender = data.sender;
                 var username = data.username;
                 
                var socketIndex = connectedSocketIds.indexOf(socket.id);
                    
                 //socket.broadcast.emit('message', { message: message, sender: sender });
                io.sockets.emit('message', { socketindex: socketIndex, message: message, sender: sender, username: username });
             
             });
                 
              
            ss(socket).on('file-upload', function(fileStream, data) {
                
                var socketIndex = connectedSocketIds.indexOf(socket.id);
                
                socket.broadcast.emit('sent-file-incoming', { username: data.username, socketindex: socketIndex, sender: data.sender, name: data.name });
                
                var cleanName = sanitize(data.name);
     
                 fileUploadWriteStream = fs.createWriteStream(upload_dir + "/" + cleanName);
                 fileStream.pipe(fileUploadWriteStream);
                 
                    fileStream.on('end', function() {
                        
                    console.log('File successfully uploaded: ' + cleanName);
                    
                    //TELL SENDER IT'S DONE//
                    socket.emit('file-transfer-finished', { username: data.username, socketindex: socketIndex, sender: data.sender, name: cleanName });
                    
                    //SEND THE FILE URL TO THE OTHER(S)//
                    socket.broadcast.emit('sent-file', { username: data.username, socketindex: socketIndex, sender: data.sender, name: cleanName });
                    //io.sockets.emit('sent-file', { username: data.username, socketindex: socketIndex, sender: data.sender, name: cleanName });
           
                });
        
        
            });
    
        
    /////AUDIO STREAMS/////
            
    ss(socket).on('audio-file', function(inbound_stream, data) {
            
        console.log('receiving file stream: ' + data.name);
                
            var socketIndex = connectedSocketIds.indexOf(socket.id);          
            var mimeType = data.type;             
            var senderSocketId = socket.id;
            
            //socket.broadcast.emit('audio-file-incoming', { audioType: mimeType, socketindex: socketIndex, username: data.username, sender: data.sender, name: data.name});
            io.sockets.emit('audio-file-incoming', { audioType: mimeType, socketindex: socketIndex, username: data.username, sender: data.sender, name: data.name});
         
                        
            /*var decoder = new lame.Decoder();
                      
            var encoder = new lame.Encoder({
              // input 
              channels: 2,        // 2 channels (left and right) 
              bitDepth: 16,       // 16-bit samples 
              sampleRate: 44100,  // 44,100 Hz sample rate 
             
              // output 
              bitRate: 128,
              outSampleRate: 44100,
              mode: lame.STEREO // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO 
            });*/
                 
      
            const Writable = require('stream').Writable;
                
                var buffer = [];
         
                const socketSendWritableMp3 = new Writable({
                    
                  write(chunk, encoding, callback) {
                    
                    buffer.push(chunk);

                     //console.log(chunk);
        
                    if(buffer.length >= 50) {
                        
                        var bufferConcat = Buffer.concat(buffer);
                         
                             //socket.broadcast.emit('audio', { buffer: bufferConcat});
                             io.sockets.emit('audio', { buffer: bufferConcat});
                              
                       buffer = [];
                    }
                
                    callback();
                  }
                
                });
                    
                  
            const Transform = require('stream').Transform;
              
            const transformWav = new Transform({
              write(chunk, encoding, callback) {
             
                this.push(new Buffer(chunk, 'binary'));
            
                callback();
              }
            });
            

              if (mimeType === 'audio/wav/stream') {
                
                console.log('audio/wav/stream');
           
                    var command = SoxCommand();
                    
                    command.input(inbound_stream)
                        .inputFileType('raw')
                        .inputSampleRate('88.2k')
                        .inputEncoding('signed')
                        .inputBits(16)
                        .output(socketSendWritableMp3)
                        .outputBits(16)
                        .outputFileType('mp3')
                        .outputSampleRate('44.1k')
                        .outputBitRate('128')
                    
                    command.run();
      
                } else if (mimeType === 'audio/wav') {                 
                                     
                    console.log('audio/wav');
                    
                  var command = SoxCommand();
                    
                    command.input(inbound_stream)
                        .inputFileType('wav')
                        .output(socketSendWritableMp3)
                        .outputBits(16)
                        .outputFileType('mp3')
                        .outputSampleRate('44.1k')
                        .outputBitRate('128');
                     
                    command.run();
                  
                } else if (mimeType === 'audio/mp3') {
                    
                    console.log('audio/mp3');
                    inbound_stream.pipe(socketSendWritableMp3);
                  
                }
                
                
                 console.log('sending stream to client(s): '  + data.name);
                            
                        socket.on('stop-audio-stream', function (data) {
                            
                            var proc = require('child_process').spawn('sox');
                            proc.kill('SIGINT');
                 
                            console.log('Stopping stream from stop message INSIDE stream');  
           
                            inbound_stream.read(0);
                            inbound_stream.push(null);
                            inbound_stream.end();
                            inbound_stream.destroy();
                            
                            socketSendWritableMp3.end();

                            buffer = [];
                            
                            //socket.disconnect();

                        });
    
                           
                        inbound_stream.on('end', function() {
                                console.log('Inbound audio stream ended: ' + data.name);
                        });
                
                      return inbound_stream;
                      
                });
                 
         
                socket.on('disconnect', function() {
                        
                     var proc = require('child_process').spawn('sox');
                     proc.kill('SIGINT');
                        
                      var handshake = socket.handshake;
                      var username = handshake.query.username;
    
                      deleteFromArray(connectedSocketIds, socket.id);
                      deleteFromArray(connectedUsernames, username);
                      
                      console.log('client disconnected');
                      
                      io.sockets.emit('connected-clients', {connectedSocketIds: JSON.stringify(connectedSocketIds), connectedUsernames: JSON.stringify(connectedUsernames) });
                      
                });
                   
                         
                socket.on('stop-audio-stream', function (data) {

                    console.log('Stopping stream from stop message OUTSIDE stream');   
                    
                    io.sockets.emit('stop-audio-stream');

                });
    
        
                
    });


    // Error handler:
    io.sockets.on("error", function(event){
        console.log("Error from uploader", event);
    });
    
    
    io.sockets.on('disconnect',function(){
          console.log('SocketIO client disconnected');
    });
        
        
    /////GENERAL API TRAFFIC/////
    
    server.get('/api', function (req, res) {
      res.send('Welcome to the Node API!');
    });


    //FILE TRANSFER//
    server.get('/api/download', function (req, res) {
        
        var requestedFile = decodeURIComponent(req.query.file);
       
        var file = upload_dir + "/" + requestedFile;
    
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
    
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
    
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      
    });
