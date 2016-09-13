var SignupView = Backbone.View.extend({
    
    initialize: function(options){
        
        console.log('new signup view');
        var self = this;
        
        this.options = options;
                
            this.render = _.wrap(this.render, function(render) {
                           this.beforeRender();
                           render();						
                           this.afterRender();
            });
            
            this.render();

    },
  
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        //this.undelegateEvents();
	//this.$el.removeData().unbind();
        
        //this.$el.empty().off(); 
        //this.stopListening();
        
    },
		
    afterRender: function(){
        
        new UsernameFormView();
        
    },

    events: {
   
    },
    
    destroy: function() { 

        
        //this.undelegateEvents();
        this.undelegateEvents();
	this.$el.removeData().unbind();
        //return this;
        //Backbone.View.prototype.remove.call(this);
      
    }
    
    
   
});