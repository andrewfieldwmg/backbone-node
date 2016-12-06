    //CONFIG
    var config = require('./config');
    var utils = require('./utils');

    //EXPRESS
    var express = require('express');
    
    //START THE API
    //var api = express();
    //module.exports.api = api;
    //require("./api.js");
    
    //SOCKET IO
    var socketApp = express();
    var socketio_app = socketApp.listen(8080);
    var io = require('socket.io')(socketio_app);
    var ss = require('socket.io-stream');
    
    //UTILS
    var ip = require("ip");
    var im = require('imagemagick');
    
    //AUDIO
    var SoxCommand = require('sox-audio');    
    var waveform = require('waveform');

    // FILE SYSTEM and STREAMS
    var fs = require('fs');
    var path = require("path");
    var mime = require('mime');
    var sanitize = require("sanitize-filename");
    const Writable = require('stream').Writable;     
    var proc = require('child_process').spawn('sox');
    
    //MAIL//          
    var nodemailer = require('nodemailer');

    //ENCRYPTION//
    
    var crypto = require('crypto'),
        algorithm = 'aes-256-ctr',
        password = 'd6F3Efeq';
        
    //DB MODELS//
    var User = require("./models/user.js");
    var Message = require("./models/message.js");
    var Channel = require("./models/channel.js");
    var File = require("./models/file.js");
    var Stream = require("./models/stream.js");
    var PrivateMessage = require("./models/privateMessage.js");
    
    //MODULES//
    var connectionModule = require("./modules/connection.js");
    var channelModule = require("./modules/channel.js");
    var streamModule = require("./modules/stream.js");
    var messageModule = require("./modules/message.js");
    var userModule = require("./modules/user.js");
    var audioModule = require("./modules/audio.js");
    var privateMessageModule = require("./modules/privateMessage.js");
    var fileModule = require("./modules/file.js");
    var mailModule = require("./modules/mail.js");
 

    //FILE TRANSFER//
    socketApp.get('/api/download', function (req, res) {
        fileModule.serveDownload(req, res, config, fs, path, mime);
    });
    
    // STREAM INFO VIA AJAX
    socketApp.get('/api/getStreamInfo', function (req, res) {
        streamModule.getStreamInfo(req, res, Stream);
    });

    ///SOCKET IO BELOW THIS POINT///
    
    //var connectedSocketIds = [];
    //var connectedUsernames = [];
    //var connectedUserIds = [];

    io.sockets.on('connection', function (socket) {

        console.log('socket connected');

  
        connectionModule.connect(io, socket, mailModule, config, User, fs, utils);

         //USER SIGNUP//
         
        socket.on('user-login', function (data) {
            userModule.processUserLogin(io, socket, data, User, crypto, algorithm, password);
        });
          
               
        socket.on('new-user-email', function (data) {
                userModule.processNewUserEmail(io, socket, data, User, utils);
         });
        
        socket.on('new-username', function (data) {
            userModule.processNewUsername(io, socket, data, User, utils);
        });
    
         socket.on('new-user-genre', function (data) { 
            userModule.processNewUserGenre(io, socket, data, User);
         });
         
        socket.on('new-user-location', function (data) {
            userModule.processNewUserLocation(io, socket, data, User);
         });
            
        ss(socket).on('new-user-profile-image', function(fileStream, data) {
            userModule.processNewUserProfileImage(io, socket, data, config, fs, fileStream, im);                 
        });
        
        socket.on('new-user-password', function (data) {
            userModule.processNewUserPassword(io, socket, data, User, crypto, algorithm, password);
         });
        
        
        //USER INFO//
        
        socket.on('check-user-status', function (data) {
                userModule.checkUserStatus(io, socket, data, User);
        });
           
        socket.on('get-user', function (data) {
                userModule.getUser(io, socket, data, User);
        });     
            
    
        //NEW CHANNEL MESSAGE//
        
        socket.on('message', function (data) {         
           console.log('Received a message!' + data.message);
           messageModule.processNewMessage(io, socket, data, Message, Channel);
           
                   
  io.sockets.emit("message", data);
  
        });
            
               
        //PRIVATE MESSAGES//
        
        socket.on("count-private-messages", function(data) {
            privateMessageModule.countPrivateMessages(io, socket, data, PrivateMessage);
        });
        
        socket.on("get-private-messages", function(data) {    
            privateMessageModule.getPrivateMessages(io, socket, data, PrivateMessage);     
        });
          
        socket.on("delete-private-message", function(data) {
            privateMessageModule.deletePrivateMessage(io, socket, data, PrivateMessage);      
        });
          
        socket.on("user-contact-request", function(data) {
             privateMessageModule.userContactRequest(io, socket, data, User, PrivateMessage);    
        });
        
        socket.on("accept-contact-request", function(data) {
             privateMessageModule.acceptContactRequest(io, socket, data, User, PrivateMessage, Channel, userModule, utils); 
        });
          
              
        //FILE TRANSFER//
        
        ss(socket).on('file-upload', function(fileStream, data) {
                fileModule.processFileTransfer(io, socket, data, fileStream, File, Message, Channel, config, fs, sanitize);
        });
    
        
        //INSTANTIATE and RE-INSTANTIATE THE APP//
        
        socket.on('refresh-connection', function(data) {
            //console.log('refresh connection');
            connectionModule.refreshConnection(io, socket, data, User, Channel, Stream, userModule, streamModule, mailModule, utils);
        });
                   

        //CHANNELS//
        
        socket.on('create-channel', function (data) {
            channelModule.createChannel(io, socket, data, Channel, User, utils);
        });
         
        socket.on('enter-channel', function (data) {
             console.log('enter-channel');
             channelModule.enterChannel(io, socket, data, User, Channel, Message, userModule, messageModule, utils);
        });
        
            
        //AUDIO//
                    
        socket.on('set-volume', function (data) {
            audioModule.setVolume(io, socket, data);
        });
                      
        socket.on('listen-to-featured-stream', function(data) {
            audioModule.listenToFeaturedStream(io, socket, data, Stream, Writable, fs, config);
        });
    
        socket.on('stop-featured-audio-stream', function (data) {
                audioModule.stopFeaturedAudioStream(io, socket);  
        });
        
        ss(socket).on('audio-file', function(inboundStream, data) {
                audioModule.processIncomingAudioStream(io, socket, data, inboundStream, Writable, Stream, streamModule, Message, Channel, fs, config, SoxCommand, proc, waveform, utils);
        });  
                                
        socket.on('stop-audio-stream', function (data) {
                audioModule.stopAudioStream(io, socket, data);
        });
     
        socket.on("upvote-stream", function(data) {
                audioModule.upvoteStream(io, socket, data, User, Message, Stream, Channel);
        });
        
        socket.on("update-current-play-time", function(data) {
                audioModule.updateCurrentStreamTime(io, socket, data, Channel);
        });
        
        socket.on("stream-started", function(data) {
                console.log("STREAM STARTED");
                streamModule.updateAvailableStreams(io, socket, Stream);
        });
        
     
        //DISCONNECT//
        
        socket.on('disconnect', function() {
                connectionModule.disconnect(io, socket, proc, userModule, User, Stream, Channel, utils);
        });

    });
    
    
        //SPARES?//
        
        io.sockets.on("error", function(event) {
            ////console.log("Error from uploader", event);
        });
        
        
        io.sockets.on('disconnect',function() {
            //console.log('SocketIO client disconnected - all sockets');
        });
        
