var Router = Backbone.Router.extend({
    
   routes: {
        "" : "root",
        "home" : "home",
        "rooms/:id" : "room"
   },
   
   root: function() {
        this.navigate("home", {trigger: "true"}); 
   },
   
   home: function() {
    
       new HomeView();
    
   },
   
   room: function(roomId) {

        new InsideRoomView({roomId: roomId});
    
   }
   
});
