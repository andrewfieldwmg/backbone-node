var sequelize = require("../database.js");

var crypto = require('crypto');
var DataTypes = require("sequelize");
    
    var File = sequelize.define('files', {
        
        filename: DataTypes.STRING,
        uploadedByUserId: DataTypes.STRING,
        uploadedByUsername: DataTypes.STRING,
        roomId: DataTypes.STRING,
        roomName: DataTypes.STRING,
        downloadedBy: DataTypes.STRING
      }, {
        
        instanceMethods: {
                
                retrieveAll: function(onSuccess, onError) {
                    File.findAll({}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
                
                findAllWhere: function(file_id, onSuccess, onError) {
                    File.findAll({where: {id: file_id }})
                       .success(onSuccess).error(onError);
                },
              
                retrieveById: function(file_id, onSuccess, onError) {
                    File.find({where: {id: file_id}}, {raw: true})
                            .success(onSuccess).error(onError);	
                },
              
                add: function(onSuccess, onError) {
                    
                    var filename = this.filename;
                    var downloadedBy = this.downloadedBy;
                    var uploadedByUserId = this.uploadedByUserId;
                    var uploadedByUsername = this.uploadedByUsername;
                    var roomId = this.roomId;
                    var roomName = this.roomName;
                    
                    File.build({
                                filename: filename,
                               uploadedByUserId: uploadedByUserId,
                               uploadedByUsername: uploadedByUsername,
                               roomId: roomId,
                               roomName: roomName,
                               downloadedBy: downloadedBy
                               })
                            .save().success(onSuccess).error(onError);
                },
               
                updateById: function(file_id, onSuccess, onError) {
                    
                    var filename = this.filename;
                    var downloadedBy = this.downloadedBy;
                    var uploadedByUserId = this.uploadedByUserId;
                    var uploadedByUsername = this.uploadedByUsername;
                    var roomId = this.roomId;
                    var roomName = this.roomName;
                    
                    File.update({
                                filename: filename,
                                uploadedByUserId: uploadedByUserId,
                                uploadedByUsername: uploadedByUsername,
                                roomId: roomId,
                                roomName: roomName,
                                downloadedBy: downloadedBy                
                                },
                                {id: file_id} )
                            .success(onSuccess).error(onError);
                },
                
                removeById: function(file_id, onSuccess, onError) {
                    File.destroy({id: file_id}).success(onSuccess).error(onError);	
                }

            }
      });
    
     module.exports = File;
    