module.exports = {
    
    countPrivateMessages: function(io, socket, data, PrivateMessage) {
        
                var privateMessage = PrivateMessage.build();
               
                privateMessage.countUserMessages(data.userId, function(privateMessages) {
                                                        
                            if (privateMessages) {
                            
                             console.log(privateMessages.length);
                             socket.emit("private-message-count", {
                                messageCount: privateMessages.length,
                                updateType: "old"
                                });
                             
                           } else {
                             //res.send(401, "User not found");
                           }
                           
                     }, function(error) {
                           //res.send("User not found");
                     });
                                
    },
            
               
    getPrivateMessages: function(io, socket, data, PrivateMessage) {
        
        var privateMessage = PrivateMessage.build();
       
        privateMessage.findAllWhereRecipientId(data.userId, null, function(privateMessages) {
                                                
                    if (privateMessages) {
                                  
                        socket.emit("user-private-messages", {
                           privateMessages: JSON.stringify(privateMessages)
                           });
                     
                   } else {
                     //res.send(401, "User not found");
                   }
                   
             }, function(error) {
                   //res.send("User not found");
             });
                        
    },
            
    
    deletePrivateMessage: function(io, socket, data, PrivateMessage) {
        
                var privateMessage = PrivateMessage.build();
                                                    
                     privateMessage.status = "deleted";
        
                     privateMessage.updateStatusById(data.messageId, function(success) {
                         
                             if (success) {	
                                        
                                        privateMessage.countUserMessages(data.userId, function(privateMessages) {
                                                        
                                            if (privateMessages) {
                              
                                             socket.emit("private-message-count", {
                                                messageCount: privateMessages.length,
                                                updateType: "new"
                                                });
                                             
                                           } else {
                                             //res.send(401, "User not found");
                                           }
                                           
                                     }, function(error) {
                                           //res.send("User not found");
                                     });
                                                
                             } else {
                               //res.send(401, "User not found");
                             }
                       }, function(error) {
                             //res.send("User not found");
                       });
                                
    },
            
    
    userContactRequest: function(io, socket, data, User, PrivateMessage) {
                     
                
                var messageContent = "I'd like to add you to my Contacts List.";
                
                    var privateMessage = PrivateMessage.build({
                                        messageContent: messageContent,
                                        messageType: "Contact Request",
                                        recipientUserId: data.recipientUserId,
                                        recipientUsername: data.recipientUsername,
                                        senderUserId: data.senderUserId,
                                        senderUsername: data.senderUsername,
                                        status: "unread"
                                        });
                  
                    privateMessage.add(function(success) {
                               
                        privateMessage.countUserMessages(data.recipientUserId, function(privateMessages) {
                                                        
                            if (privateMessages) {
                                                      
                                    var user = User.build();
                                    
                                    user.retrieveById(data.recipientUserId, function(users) {
                                            
                                            if (users) {
                             
                                                    io.to(users.socketId).emit("private-message-count", {
                                                        messageCount: privateMessages.length,
                                                        updateType: "new"
                                                        });
                                       
                                    
                                            } else {
                                              //res.send(401, "User not found");
                                            }
                                            
                                      }, function(error) {
                                            //res.send("User not found");
                                      });
                    
                             
                           } else {
                             //res.send(401, "User not found");
                           }
                           
                     }, function(error) {
                           //res.send("User not found");
                     });
                                
                                
                                
                    },
                    function(err) {
                        ////console.log("New message NOT written to database");
                    });
    
                
    },
            
    
    acceptContactRequest: function(io, socket, data, User, PrivateMessage, Channel, userModule, utils) {
            
            var requesteeUserId = data.userId;
            var requesterUserId = data.requesterUserId;
            var messageId = data.messageId;
            
                var user = User.build();
                
                user.retrieveById(requesteeUserId, function(users) {
                    
                        if (users) {
                            
                            var userContactsArray = [];
                            ////console.log('usersinchannel' + users.inChannels);
                            
                            if(typeof users.userContacts === 'undefined' ||  users.userContacts == "" || users.userContacts == null || users.userContacts == "null") {
                               
                                ////console.log('no inChannel');
                                 userContactsArray.push(requesterUserId.toString());
                                
                            } else {
                                
                                ////console.log('already inChannel');
                                
                                var parsedUserContacts = JSON.parse(users.userContacts);
                                ////console.log(parsedInChannels);
                                for(i = 0; i < parsedUserContacts.length; i++) {
                                    userContactsArray.push(parsedUserContacts[i].toString());
                                }
                                
                                userContactsArray.push(requesterUserId.toString());
                                
                            }
                                var uniqueUserContactsArray = Array.from(new Set(userContactsArray));
                                
                                user.userContacts = JSON.stringify(uniqueUserContactsArray);
                                
                                user.updateContacts(requesteeUserId, function(success) {
                                    
                                        if (success) {	
                                                //var channelsForUser = [];
                                                socket.emit("user-contact-completed", {requesterUserId: requesterUserId});
                                                
                                                    var privateMessage = PrivateMessage.build();
                                            
                                                        privateMessage.status = "completed";
                                           
                                                        privateMessage.updateStatusById(messageId, function(success) {
                                                            
                                                                if (success) {	
                                                                           
                                                                           privateMessage.countUserMessages(data.userId, function(privateMessages) {
                                                                                           
                                                                               if (privateMessages) {
                                                                 
                                                                                socket.emit("private-message-count", {
                                                                                   messageCount: privateMessages.length,
                                                                                   updateType: "new"
                                                                                   });
                                                                                
                                                                                 userModule.updateUserContactsView(io, socket, Channel, User, utils, data.userId);          
                                                                                
                                                                              } else {
                                                                                //res.send(401, "User not found");
                                                                              }
                                                                              
                                                                        }, function(error) {
                                                                              //res.send("User not found");
                                                                        });
                                                                                   
                                                                } else {
                                                                  //res.send(401, "User not found");
                                                                }
                                                          }, function(error) {
                                                                //res.send("User not found");
                                                          });
                     
                     
                                        } else {
                                          //res.send(401, "User not found");
                                        }
                                        
                                        
                                  }, function(error) {
                                        //res.send("User not found");
                                  });
                             
         
                        } else {
       
                        }
                  }, function(error) {
                     
                  });
                
                
                
                    user.retrieveById(requesterUserId, function(users) {
                    
                        if (users) {
                            
                            var userContactsArray = [];
    
                            if(typeof users.userContacts === 'undefined' ||  users.userContacts == "" || users.userContacts == null || users.userContacts == "null") {
                               
                                 userContactsArray.push(requesteeUserId.toString());
                                
                            } else {
                                
                                var parsedUserContacts = JSON.parse(users.userContacts);
                                for(i = 0; i < parsedUserContacts.length; i++) {
                                    userContactsArray.push(parsedUserContacts[i].toString());
                                }
                                
                                userContactsArray.push(requesteeUserId.toString());
                                
                            }
                                                                 
                               var uniqueUserContactsArray = Array.from(new Set(userContactsArray));
                                
                                user.userContacts = JSON.stringify(uniqueUserContactsArray);
                                
                                user.updateContacts(requesterUserId, function(success) {
                                    
                                        if (success) {	
                                                //var channelsForUser = [];
                                                userModule.updateUserContactsView(io, socket, Channel, User, utils, requesterUserId); 
                                                
                                        } else {
                                          //res.send(401, "User not found");
                                        }
                                        
                                        
                                  }, function(error) {
                                        //res.send("User not found");
                                  });
                             
         
                        } else {
       
                        }
                  }, function(error) {
                     
                  });
                
                
                
    }

}