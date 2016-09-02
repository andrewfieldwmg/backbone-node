var WelcomeModalView = Backbone.View.extend({
    
    el: $("#welcome_modal_container"),
    
    initialize: function(options){
        
        var self = this;
        
        this.options = options;

            this.render = _.wrap(this.render, function(render) {
                           this.beforeRender();
                           render();						
                           //this.afterRender();
                   });						
                   

        this.render();
        
    },
  
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
        
	var self = this;
	
        //localStorage.setItem('roomsModalViewLoaded', "true");

       var compiledTemplate = _.template( $("#welcome_modal_template").html());                     
       this.$el.html( compiledTemplate);
       
       $('.welcome-modal').modal();
       
            $('.welcome-modal').on('hidden.bs.modal', function () {
		self.destroy();
	    });
	    
    },

    events: {

     
    },
    
    destroy: function() { 

	
	//$('.invitation-modal').modal("hide");
	
        //localStorage.setItem('roomsModalViewLoaded', "false");
        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
        var router = new Router();
        router.navigate("home", {trigger: "true"});
      
    }
    
    
   
});