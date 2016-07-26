//Includes + requires
var express = require('express');
var server = express();
var ip = require("ip");
var siofu = require("socketio-file-upload");
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var wav = require('wav');
var path = require("path");
var im = require('imagemagick');

var socketio_app = server.use(siofu.router).listen(8080);

var io = require('socket.io')(socketio_app);
var ss = require('socket.io-stream');


function getExtension(filename) {
    return filename.split('.').pop();
}


var audio_path = path.join(__dirname, '../', 'public/uploads/audio')
var audio_filename = 'demo.wav';
var outFile = audio_path + '/'+ audio_filename;


/////BINARY JS//////
/*
binaryServer = BinaryServer({port: 8090});

binaryServer.on('connection', function(client) {
console.log('BinaryJS client connected');

  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 44100,
    bitDepth: 16
  });

  client.on('stream', function(stream, meta) {
    console.log('new stream');
    

    //stream.pipe(fileWriter);
     
        //var send = client.createStream(audio_path + '/test.wav');
        //stream.pipe(send);
        
  var file = fs.createReadStream(audio_path + '/test_128.mp3');
  
   file.on('data', function(chunk){
    //console.log(chunk);
         client.send(chunk);
    });
    

    stream.on('end', function() {
      fileWriter.end();
      console.log('wrote to file ' + outFile);
    });
    
  });
 });
*/

    

/////SOCKET IO//////
   
        io.sockets.on('message', function (data) {
            console.log('Received a message!' + data.message);
            var message = data.message;
            var sender = data.sender;
            
            io.sockets.emit('message', { message: message, sender: sender });
        
        });
        
        // Error handler:
        io.sockets.on("error", function(event){
            console.log("Error from uploader", event);
        });
        
        
        io.sockets.on('disconnect',function(){
              console.log('SocketIO client disconnected');
        
        });
    
    
    //var socketId = socket.id;
    //var clientIp = socket.request.connection.remoteAddress;
    var upload_dir = path.join(__dirname, '../', 'public/uploads');  
    


io.sockets.on('connection', function (socket) {
    
          console.log('SocketIO client connected');
 
 
        socket.on('file', function(data) {
            
            //console.log("receiving file data");
            
                function toArrayBuffer(buffer) {
                 
                     var ab = new ArrayBuffer(buffer.length);
                     var view = new Uint8Array(ab);
                     for (var i = 0; i < buffer.length; ++i) {
                         view[i] = buffer[i];
                     }
                     return ab;
                 }
                    
            var arrayBuffer = toArrayBuffer(data.buffer.data);
            
            io.sockets.emit('audio', { buffer: arrayBuffer });

        });
            
             
        socket.on('stop-audio-stream', function (data) {
            
            console.log('stop message received');

            socket.disconnect();
      
        });
           
           
        //WRITE THE FILE TO THE SERVER ALSO...
        //var file_write_stream = fs.createWriteStream(path.normalize(audio_path + "/" + data.name));
        //inbound_stream.pipe(file_write_stream);

            //var outbound_stream = ss.createStream();
            //ss(socket).emit('audio', outbound_stream);
            //inbound_stream.pipe(outbound_stream);            
  
            //console.log('sending stream to client(s)');
            
                 
            //RETRY THIS TO HIT ALL CLIENTS
            
            /*
            inbound_stream.on('data', function(chunk) {
                
            // use a chunk of image. a chunk is a Buffer.
                //console.log('receiving data from file stream');
                
                //THIS IS THE NON-FULLY-STREAMING BIT? THAT WORKS
                io.sockets.emit('audio', { buffer: chunk });
   
            });
        
       

        
        inbound_stream.on('end', function() {
            console.log('Audio stream ended: ' + data.name);
        });*/

 
        // THIS ONE WORKS BUT ISN'T STREAMING REALLY...   
        /*socket.on('audio-stream', function (data) {
               
               console.log('receiving file stream');
          
               //var outbound_stream = ss.createStream();
               //ss(socket).emit('audio', outbound_stream);
               //inbound_stream.pipe(outbound_stream);
                   
               // use a chunk of image. a chunk is a Buffer.
                   //console.log('receiving data from file stream');
                   io.sockets.emit('audio', { buffer: data.buffer });   
             
           });*/
    
  
 
});
 
    
    
//IMAGE UPLOAD USING THE OTHER LIBRARY - CAN WE REPLACE THIS WITH STANDARD SOCKET IO NOW?
    /*var uploader = new siofu();
    uploader.dir = upload_dir;
    uploader.listen(socket);
    
    
    // Do something when a file is saved:
    uploader.on("saved", function(event){
        
        if (event.file.meta.type === "image") {
        
                var just_filename = event.file.name.slice(0, -4);
                var just_extension = getExtension(event.file.name);
                var thumbnail_filename = just_filename + "_small." + just_extension;
                
                im.resize({
                    srcData: fs.readFileSync(uploader.dir + "/" + event.file.name, 'binary'),
                    width:   256
                  }, function(err, stdout, stderr){
                    if (err) throw err
                    fs.writeFileSync(uploader.dir + "/" + thumbnail_filename, stdout, 'binary');
                    console.log('resized ' + event.file.name + ' to fit within 256x256px')
                  
                    //fs.readFile(uploader.dir + "/" + event.file.name, function(err, buf){
                        io.sockets.emit('image', { src: "/uploads/" +  thumbnail_filename });
        
                    //}) 
          
                });
        
        }
          
    });*/

    
        /*socket.on('play-audio', function (data) {
            
                var file = fs.createReadStream(audio_path + '/test_128.mp3');
              
                file.on('data', function(buffer){
                    io.sockets.emit('audio', { buffer: buffer });
                });
        
        });*/
        


/////GENERAL API TRAFFIC/////

server.get('/api', function (req, res) {
  res.send('Welcome to the Node API!');
});
