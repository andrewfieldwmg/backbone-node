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


/////SOCKET IO//////
    io.sockets.on('connection', function (socket) {
     
         socket.on('message', function (data) {
             console.log('Received a messaage!' + data.message);
             var message = data.message;
             var sender = data.sender;
             
             io.sockets.emit('message', { message: message, sender: sender });
         
         });
         
         
          
        ss(socket).on('file-upload', function(fileStream, data) {
            
            var cleanName = sanitize(data.name);
            
             fileUploadWriteStream = fs.createWriteStream(upload_dir + "/" + cleanName);
             fileStream.pipe(fileUploadWriteStream);
             
                fileStream.on('end', function() {
                    
                console.log('File successfully uploaded: ' + cleanName);
                
                io.sockets.emit('sent-file', { name: cleanName });
       
            });
    
    
         });
         

                    /*if (event.file.meta.type === "image") {
                    
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
                    
                    }*/
                      
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



// AUDIO STREAM //////

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
    });*/
   
   
//inbound_stream.pipe(encoder).pipe(myWritable);
  
         
         
// TRY AND WRITE THE FILE FIRST, AND STREAM THAT?

inbound_stream.pipe(encoder).pipe(fs.createWriteStream(mp3RecordingFile));
         
var watcher = fs.watch(mp3RecordingFile);

watcher.on('change', (event, path) => {
    
      fs.stat(mp3RecordingFile, function (err, stats) {
        
        console.log(stats.size);
        
        if (stats.size > 512000) {
    
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
                        
                        // also need to disconnect the other person's socket, by emitting....?
                  
                    });
                                       
                    
            inbound_stream.on('end', function() {
                //fileWriter.end();
                console.log('Inbound audio stream ended: ' + data.name);
       
            });
    
          
        });
        
        
/////AUDIO FILE/////

ss(socket).on('audio-file', function(inbound_stream, data) {

        console.log('receiving file stream: ' + data.name);
        
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
         
        //var wavWriter = new wav.Writer();
    
    // DO IT AS A DIRECT STREAM, PLUS A FILE WRITE IF NECESSARY
    
    var audioFile = fs.createWriteStream(audioPath + '/' +  data.name);
        
    const Writable = require('stream').Writable;
        
        var buffer = [];
    
        const CHUNK_SIZE = 102400; //100kb
        
        const socketSendWritable = new Writable({
          write(chunk, encoding, callback) {
            
            buffer.push(chunk);
    
             //audioFile.write(chunk);
             
             //console.log(chunk);
             
            if(buffer.length >= 40) {
                
                var bufferConcat = Buffer.concat(buffer);
                 
                    io.sockets.emit('audio', { buffer: bufferConcat});
                      
               buffer = [];
            }
        
            callback();
          }
        });

        
      function convertoFloat32ToInt16(buffer) {
              var l = buffer.length;
              var buf = new Int16Array(l)
        
              while (l--) {
                buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
              }
              return buf.buffer
            }
               
        function floatTo16Bit(inputArray, startIndex){
            var output = new Uint16Array(inputArray.length-startIndex);
            for (var i = 0; i < inputArray.length; i++){
                var s = Math.max(-1, Math.min(1, inputArray[i]));
                output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            return output;
        }


        const Transform = require('stream').Transform;
          
        const convertWritable = new Transform({
          write(chunk, encoding, callback) {

            this.push(new Buffer( chunk, 'binary' ));
        
            callback();
          }
        });
        

    
//inbound_stream.pipe(socketSendWritable);


    if (mimeType === 'audio/wav') {
        
      inbound_stream.pipe(encoder).pipe(socketSendWritable);
      
    } else if (mimeType === 'audio/mp3') {
        
      inbound_stream.pipe(socketSendWritable);
      
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
        
        
        
     
            socket.on('disconnect', function() {
              deleteFromArray(clients, socket);
              console.log('client disconnected');
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

