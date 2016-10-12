var Router = Backbone.Router.extend({
    
   routes: {
        "" : "root",
        "signup" : "signup",
        "welcome" : "welcome",
        "home" : "home",
        "channels/:id" : "channel"
   },
   
   root: function() {
      
      if(localStorage.getItem("userId") !== null) {
         this.navigate("home", {trigger: "true"});
      } else {
         this.navigate("signup", {trigger: "true"});
      }
      
   },
   
   signup: function() {
     
      if(localStorage.getItem("userId") !== null) {     
         this.navigate("home", {trigger: "true"});
      } else {
          new SignupView();
      }
      
   },
   
   welcome: function() {
     
      if(localStorage.getItem("userId") !== null) {     
         new NewHomeView({showWelcome: true});
      } else {
         this.navigate("signup", {trigger: "true"});
      }
      
   },
   
   home: function() {
    
      if(localStorage.getItem("userId") !== null) {    
         new NewHomeView({showWelcome: false});
      } else {
         this.navigate("signup", {trigger: "true"});
      }
 
    
   },
   
   channel: function(channelId) {
      
      if(localStorage.getItem("userId") !== null && channelId !== null) {    
           new InsideChannelView({channelId: channelId});
      } else {
            this.navigate("home", {trigger: "true"});
      }
      
    
   }
   
});
