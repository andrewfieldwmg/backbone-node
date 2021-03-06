var path = require("path");

var config = {};

config.filePaths = {};
config.filePaths.uploadFolder = "/uploads";
config.filePaths.uploadDir = path.join(__dirname, '../', 'public' + config.filePaths.uploadFolder); 
config.filePaths.userDataDir = path.join(config.filePaths.uploadDir + "/user-data");
config.filePaths.fileTransferDir = path.join(config.filePaths.uploadDir + "/file-transfers");
config.filePaths.userProfileImageDir = path.join(config.filePaths.userDataDir + "/profile-images");
config.filePaths.audioPath = path.join(config.filePaths.uploadDir + '/audio');
config.filePaths.waveformPath = path.join(config.filePaths.uploadDir + '/waveforms');

config.smtpConfig = {
            host: 'mail.listentome.io',
            port: 25,
            secure: false
        };
    
module.exports = config;