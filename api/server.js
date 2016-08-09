//SERVER BASICS
var express = require('express');
var server = express();
var ip = require("ip");
var cluster = require('cluster');

//AUDIO
var wav = require('wav');
var lame = require('lame');
//var im = require('imagemagick');

// FILE SYSTEM and STREAMS
var fs = require('fs');
var path = require("path");
var mime = require('mime');
var sanitize = require("sanitize-filename");
var chokidar = require('chokidar');
var growingFile = require('growing-file');
var tailingStream = require('tailing-stream');

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
    
var audioPath = path.join(__dirname, '../', 'public/uploads/audio')
var wavRecordingFilename = 'audio_recording.wav';
var mp3RecordingFilename = 'test.mp3';
var wavRecordingFile = audioPath + '/' + wavRecordingFilename;
var mp3RecordingFile = audioPath + '/' + mp3RecordingFilename;


    function deleteFromArray(my_array, element) {
      position = my_array.indexOf(element);
      my_array.splice(position, 1);
    }
    
    var clients = [];

    io.sockets.on('connection', function (socket) {
    
        var clientIp = socket.request.connection.remoteAddress;
        
            clients.push(socket.id);
            
            var socketIndex = clients.indexOf(socket.id);
            
            console.log(socketIndex);
            
            socket.emit('socket-info', { socketindex: socketIndex });
            
            console.log('SocketIO client connected: ' + socket.id);
            
            
             socket.on('message', function (data) {
                
                 console.log('Received a message!' + data.message);
                 
                 var message = data.message;
                 var sender = data.sender;
                 var username = data.username;
                 
                var socketIndex = clients.indexOf(socket.id);
                    
                 //socket.broadcast.emit('message', { message: message, sender: sender });
                io.sockets.emit('message', { socketindex: socketIndex, message: message, sender: sender, username: username });
             
             });
                 
              
            ss(socket).on('file-upload', function(fileStream, data) {
                
                var socketIndex = clients.indexOf(socket.id);
                
                socket.broadcast.emit('sent-file-incoming', { username: data.username, socketindex: socketIndex, sender: data.sender, name: data.name });
                
                var cleanName = sanitize(data.name);
                
                 fileUploadWriteStream = fs.createWriteStream(upload_dir + "/" + cleanName);
                 fileStream.pipe(fileUploadWriteStream);
                 
                    fileStream.on('end', function() {
                        
                    console.log('File successfully uploaded: ' + cleanName);
                    
                    socket.broadcast.emit('sent-file', { username: data.username, socketindex: socketIndex, sender: data.sender, name: cleanName });
           
                });
        
        
            });
    
        
            /////AUDIO FILE/////
            
            ss(socket).on('audio-file', function(inbound_stream, data) {
            
                console.log('receiving file stream: ' + data.name);
                
                    var socketIndex = clients.indexOf(socket.id);
                    
                    //socket.broadcast.emit('audio-file-incoming', { sender: data.sender, name: data.name});
                    io.sockets.emit('audio-file-incoming', { socketindex: socketIndex, username: data.username, sender: data.sender, name: data.name});
                        
                    var mimeType = data.type;
                    
                    var senderSocketId = socket.id;
              
                    var decoder = new lame.Decoder();
                              
                    var encoder = new lame.Encoder({
                      // input 
                      channels: 2,        // 2 channels (left and right) 
                      bitDepth: 16,       // 16-bit samples 
                      sampleRate: 44100,  // 44,100 Hz sample rate 
                     
                      // output 
                      bitRate: 128,
                      outSampleRate: 44100,
                      mode: lame.JOINTSTEREO // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO 
                    });
                     
                
                // DO IT AS A DIRECT STREAM, PLUS A FILE WRITE IF NECESSARY
                
                var rawAudioFile = fs.createWriteStream(audioPath + '/' +  data.name);
                //var convertedMp3File = fs.createWriteStream(audioPath + '/' +  data.name.slice(0, -4) + '.mp3');
                
                const Writable = require('stream').Writable;
                    
                    var buffer = [];
                    
                    const CHUNK_SIZE = 102400; //100kb
                    
                    const socketSendWritable = new Writable({
                        
                      write(chunk, encoding, callback) {
                        
                        buffer.push(chunk);

                         //console.log(buffer.length);
                        
                        // TODO:
                        //need to move buffer.length down bit by bit to find the sweet spot
                        // between smooth playback and latency
            
                        if(buffer.length >= 40) {
                            
                            var bufferConcat = Buffer.concat(buffer);
                             
                                 //socket.broadcast.emit('audio', { buffer: bufferConcat});
                                 io.sockets.emit('audio', { buffer: bufferConcat});
                                  
                           buffer = [];
                        }
                    
                        callback();
                      }
                    
                    });
            
            
                    const Transform = require('stream').Transform;
                      
                    const convertWritable = new Transform({
                      write(chunk, encoding, callback) {
            
                        this.push(new Buffer( chunk, 'binary' ));
                    
                        callback();
                      }
                    });
                    
            
                if (mimeType === 'audio/wav') {
                    
                  //inbound_stream.pipe(rawAudioFile);
                  inbound_stream.pipe(encoder).pipe(socketSendWritable);
                  
                } else if (mimeType === 'audio/mp3') {
                    
                  //inbound_stream.pipe(rawAudioFile);
                  inbound_stream.pipe(socketSendWritable);
                }
                
                 console.log('sending stream to client(s): '  + data.name);
                            
                        socket.on('stop-audio-stream', function (data) {
                              
                            console.log('Stopping stream from stop message INSIDE stream');  
                            
                            //io.sockets.emit('stop-audio-stream');
                            
                            inbound_stream.read(0);
                            inbound_stream.push(null);
                            inbound_stream.end();
                            inbound_stream.destroy();
                            
                            socketSendWritable.end();
                        
                            //socket.disconnect();

                        });
    
                           
                        inbound_stream.on('end', function() {
                            //fileWriter.end();
                            console.log('Inbound audio stream ended: ' + data.name);
                   
                        });
                
                      return inbound_stream;
                      
                    });
                 
         
                socket.on('disconnect', function() {
                    
                  deleteFromArray(clients, socket.id);
                  console.log('client disconnected');
                  
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


    
    server.get('/api/download', function (req, res) {
        
       var requestedFile = req.query.file;
       
       var file = upload_dir + "/" + requestedFile;
    
      var filename = path.basename(file);
      var mimetype = mime.lookup(file);
    
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);
    
      var filestream = fs.createReadStream(file);
      filestream.pipe(res);
      
    });
