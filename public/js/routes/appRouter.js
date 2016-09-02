var Router = Backbone.Router.extend({
    
   routes: {
        "" : "root",
        "signup" : "signup",
        "welcome" : "welcome",
        "home" : "home",
        "rooms/:id" : "room"
   },
   
   root: function() {
      
      if(localStorage.getItem("username")) {
         this.navigate("home", {trigger: "true"});
      } else {
         this.navigate("signup", {trigger: "true"});
      }
      
   },
   
   signup: function() {
     
      if(localStorage.getItem("username")) {     
         this.navigate("home", {trigger: "true"});
      } else {
          new SignupView();
      }
      
      
   },
   
   welcome: function() {
     
      if(localStorage.getItem("username")) {     
         new HomeView({showWelcome: true});
      } else {
         this.navigate("signup", {trigger: "true"});
      }
      
   },
   
   home: function() {
    
      if(localStorage.getItem("username")) {     
         new HomeView({showWelcome: false});
      } else {
         this.navigate("signup", {trigger: "true"});
      }
 
    
   },
   
   room: function(roomId) {

        new InsideRoomView({roomId: roomId});
    
   }
   
});
