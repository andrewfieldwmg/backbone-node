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
var lame = require('lame');

var socketio_app = server.use(siofu.router).listen(8080);

var io = require('socket.io')(socketio_app);
var ss = require('socket.io-stream');

var chokidar = require('chokidar');
var growingFile = require('growing-file');
var tailingStream = require('tailing-stream');


function getExtension(filename) {
    return filename.split('.').pop();
}


var upload_dir = path.join(__dirname, '../', 'public/uploads');  



/////SOCKET IO//////
    io.sockets.on('connection', function (socket) {
     
         socket.on('message', function (data) {
             console.log('Received a message!' + data.message);
             var message = data.message;
             var sender = data.sender;
             
             io.sockets.emit('message', { message: message, sender: sender });
         
         });
         
             

            //IMAGE UPLOAD USING THE OTHER LIBRARY - CAN WE REPLACE THIS WITH STANDARD SOCKET IO NOW?
                var uploader = new siofu();
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
                      
                });
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

    
    
    
    function deleteFromArray(my_array, element) {
      position = my_array.indexOf(element);
      my_array.splice(position, 1);
    }


// AUDIO

    var audioPath = path.join(__dirname, '../', 'public/uploads/audio')
    var wavRecordingFilename = 'audio_recording.wav';
    var mp3RecordingFilename = 'test.mp3';
    var wavRecordingFile = audioPath + '/' + wavRecordingFilename;
    var mp3RecordingFile = audioPath + '/' + mp3RecordingFilename;

    var clients = [];
  
    io.sockets.on('connection', function (socket) {
            
        clients.push(socket);
        console.log('SocketIO client connected');
    
        //console.log(socket.id + ' connected');
   
        ss(socket).on('audio-recording', function(inbound_stream, data) {

        console.log('receiving file stream: ' + data.name);
        
        var senderSocketId = socket.id;
       
        /*var fileWriter = new wav.FileWriter(wavRecordingFile, {
            channels: 2,
            sampleRate: 48000,
            bitDepth: 16
          })
               
        inbound_stream.pipe(fileWriter);*/
        
        
       //write the raw file to disk 
        //var file_write_stream = fs.createWriteStream(path.normalize(audio_path + "/" + data.name));
        //inbound_stream.pipe(file_write_stream);

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
  
  /*  
    var mp3File = fs.createWriteStream(mp3RecordingFile);
    
    const Writable = require('stream').Writable;
    
    var buffer = [];
    var chunks = 0;
    
    const CHUNK_SIZE = 102400; //100kb
    
    const myWritable = new Writable({
      write(chunk, encoding, callback) {
        
        buffer.push(chunk);
        chunks += chunk;
         
        if(chunks.length >= CHUNK_SIZE) {
        
            for(var i = 0; i < buffer.length; i++) {
                
                //mp3File.write(buffer[i]);
                io.sockets.emit('audio', { buffer: buffer[i]});
            }
           
           
           buffer = [];
           var chunks = 0;
           
        }
    
        callback();
      }
    });
    
    
    
    myWritable.on('finish', () => {
       //emit final part if there is data to emit
       if(buffer.length) {
           io.sockets.emit('audio', { buffer: buffer});
       }
    });
   
   
inbound_stream.pipe(encoder).pipe(myWritable);*/
  
         
         
// TRY AND WRITE THE FILE FIRST, AND STREAM THAT?

inbound_stream.pipe(encoder).pipe(fs.createWriteStream(mp3RecordingFile));
         
var watcher = fs.watch(mp3RecordingFile);

watcher.on('change', (event, path) => {
    
      fs.stat(mp3RecordingFile, function (err, stats) {
        
        console.log(stats.size);
        
        if (stats.size > 102400) {
    
            streamEncodedFile(); 
        
        }
        
              
    });
});


function streamEncodedFile() {
    
    console.log('stream encoded file function called');
    
    var file = tailingStream.createReadStream(mp3RecordingFile);
    
       file.on('data', function(buffer){
            //console.log(buffer);
           io.sockets.emit('audio', { buffer: buffer });
       });
       
       watcher.close();
       console.log('watcher closed'); 
}
    
       
         
            // LOOP THROUGH SOCKET STREAM STYLE, BUT DOESN@T WORK
            
            /*for(var i = 0; i < clients.length; i++) {
                
                if (clients[i].id != socket.id) {
                    var socketToSend = clients[i];         
                    var outbound_stream = ss.createStream();
                    ss(socketToSend).emit('audio', outbound_stream);
                    inbound_stream.pipe(outbound_stream);

                    console.log('sending stream to client(s):' + clients[i].id);
  
                }
            }*/
                                  
                    socket.on('stop-audio-stream', function (data) {
                          
                        inbound_stream.read(0);
                        inbound_stream.push(null);
                        inbound_stream.end();
                        inbound_stream.destroy();
      
                        socket.disconnect();
                        console.log('Client disconnected');
                  
                    });
                       

                    
                    
            inbound_stream.on('end', function() {
                //fileWriter.end();
                console.log('Inbound audio stream ended: ' + data.name);
       
            });
    
          
        });
        
        
        
ss(socket).on('audio-file', function(inbound_stream, data) {

        console.log('receiving file stream: ' + data.name);
        
        var senderSocketId = socket.id;
       
       //write the raw file to disk 
       
        //inbound_stream.pipe(file_write_stream);

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
    
    var mp3File = fs.createWriteStream(audioPath + '/' +  data.name);
    
    const Writable = require('stream').Writable;
    
    var buffer = [];
    var chunks = 0;
    
    const CHUNK_SIZE = 102400; //100kb
    
    const myWritable = new Writable({
      write(chunk, encoding, callback) {
        
        buffer.push(chunk);
        chunks += chunk;
    
         //mp3File.write(chunk);
         
        if(chunks.length >= CHUNK_SIZE) {
        
            for(var i = 0; i < buffer.length; i++) {
                   
                io.sockets.emit('audio', { buffer: buffer[i]});
            }
           //io.sockets.emit('audio', { buffer: chunk});
           
           buffer = [];
        }
    
        callback();
      }
    });



    /*myWritable.on('finish', () => {
       //emit final part if there is data to emit
       if(buffer.length) {
           io.sockets.emit('audio', { buffer: buffer});
       }
    });*/
       
   
    inbound_stream.pipe(myWritable);
         
 
            // LOOP THROUGH SOCKET STREAM STYLE, BUT DOESN@T WORK
            
            /*for(var i = 0; i < clients.length; i++) {
                
                if (clients[i].id != socket.id) {
                    var socketToSend = clients[i];         
                    var outbound_stream = ss.createStream();
                    ss(socketToSend).emit('audio', outbound_stream);
                    inbound_stream.pipe(outbound_stream);

                    console.log('sending stream to client(s):' + clients[i].id);
  
                }
            }*/
                                  
                    socket.on('stop-audio-stream', function (data) {
                          
                        inbound_stream.read(0);
                        inbound_stream.push(null);
                        inbound_stream.end();
                        inbound_stream.destroy();
      
                        socket.disconnect();
                        console.log('Client disconnected');
                  
                    });
                       

                    
                    
            inbound_stream.on('end', function() {
                //fileWriter.end();
                console.log('Inbound audio stream ended: ' + data.name);
       
            });
    
          
        });
        
        
        
     
            socket.on('disconnect', function() {
              deleteFromArray(clients, socket);
              //console.log(socket.id + ' disconnected');
            });
      
          
          
            socket.on('play-audio', function (data) {
                
                console.log('Play audio message received');
                
                    var file = fs.createReadStream(mp3RecordingFile);
                  
                    file.on('data', function(buffer){
                        io.sockets.emit('audio', { buffer: buffer });
                    });
            
            });
        
        
});





/////GENERAL API TRAFFIC/////

server.get('/api', function (req, res) {
  res.send('Welcome to the Node API!');
});
