var path = require("path");

var config = {};

config.filePaths = {};

config.filePaths.uploadFolder = "/uploads";
config.filePaths.uploadDir = path.join(__dirname, '../', 'public' + config.filePaths.uploadFolder); 

module.exports = config;