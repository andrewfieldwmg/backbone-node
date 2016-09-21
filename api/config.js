var path = require("path");

var config = {};

config.filePaths = {};

config.filePaths.uploadFolder = "/uploads";
config.filePaths.uploadDir = path.join(__dirname, '../', 'public' + config.filePaths.uploadFolder); 
config.filePaths.userDataDir = path.join(config.filePaths.uploadDir + "/user-data");
config.filePaths.userProfileImageDir = path.join(config.filePaths.userDataDir + "/profile-images");
config.filePaths.audioPath = path.join(config.filePaths.uploadDir + '/audio');

module.exports = config;