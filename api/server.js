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


function getExtension(filename) {
    return filename.split('.').pop();
}


var audioPath = path.join(__dirname, '../', 'public/uploads/audio')
var wavRecordingFilename = 'audio_recording.wav';
var mp3RecordingFilename = 'test.mp3';
var wavRecordingFile = audioPath + '/' + wavRecordingFilename;
var mp3RecordingFile = audioPath + '/' + mp3RecordingFilename;

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
    var upload_dir = path.join(__dirname, '../', 'public/uploads');  
    

    io.sockets.on('connection', function (socket) {
                    
        console.log('SocketIO client connected');
   
        ss(socket).on('file', function(inbound_stream, data) {

            console.log('receiving file stream: ' + data.name);
       
       //console.log(inbound_stream);
       
        /*var fileWriter = new wav.FileWriter(wavRecordingFile, {
            channels: 2,
            sampleRate: 48000,
            bitDepth: 16
          })
               
        inbound_stream.pipe(fileWriter);*/
          
        
       //write the raw file to disk 
        //var file_write_stream = fs.createWriteStream(path.normalize(audio_path + "/" + data.name));
        //inbound_stream.pipe(file_write_stream);
        
        
          // create the Encoder instance 
        var encoder = new lame.Encoder({
          // input 
          channels: 2,        // 2 channels (left and right) 
          bitDepth: 16,       // 16-bit samples 
          sampleRate: 48000,  // 44,100 Hz sample rate 
         
          // output 
          bitRate: 128,
          outSampleRate: 44100,
          mode: lame.STEREO // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO 
        });
         
        // raw PCM data from stdin gets piped into the encoder
        console.log('piping raw pcm stream to encoder');
        //inbound_stream.pipe(encoder);
        
        console.log('creating write stream from pipe');
        // the generated MP3 file gets piped to stdout 
        //encoder.pipe(fs.createWriteStream(mp3RecordingFile));
 
        
            console.log('sending stream to client(s):' + data.name);
            
                var file = fs.createReadStream(mp3RecordingFile);
              
                file.on('data', function(buffer) {
                    io.sockets.emit('audio', { buffer: buffer });
                });
                
                /*encoder.on('data', function(chunk) {
                //console.log(chunk);
                socket.broadcast.emit('audio', { buffer: chunk });
                //io.sockets.emit('audio', { buffer: chunk });
                });*/
                      
                      
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
     
    });


    
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
