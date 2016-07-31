function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var TaskModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/tasks'
});


var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    url: "../api/api.php/tasks/"
});


var TaskSelectorModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/task_lists'
});

var TaskSelectorCollection = Backbone.Collection.extend({
    model: TaskSelectorModel,
    url: "../api/api.php/task_lists/"
});


var TaskListChildFormView = Backbone.View.extend({

  el: $("#task_list_container"),

  tagName: "table",
      
  initialize: function(options){
    
        this.model = new TaskModel();
        this.collection = new TaskCollection();
    
        this.parent_row_id = options.parent_row_id;
        
        this.render();
  },
  
  render: function() {
    
        var parent_row = $('tbody[data-id="' + this.parent_row_id + '"]');
    
        var parameters = {parent_row_id: this.parent_row_id };
        
        var compiledTemplate = _.template( $("#task-child-list-form-template").html(), parameters);
        parent_row.append(compiledTemplate);

  },
  
  events: {

    "submit #submit-child-task": "addChildTask"
  },
  
  addChildTask: function(event) {
    
    event.preventDefault();

    var parent_id = $(event.currentTarget).data('parent-id');
    
    var new_child_task = $('.child-task-text[data-parent-id="' + parent_id + '"]').val();
    var self = this;
    
    var day_month = new Date().toDateString().substring(4);
    
        this.model.save({
            name: new_child_task,
            status: 0,
            task_list: localStorage["selected-task-list"],
            priority: parent_id + "-" + 0,
            created: day_month,
            parent_id: parent_id
            },
            {
            
        success: function (response) {
            
        var parent_model = new TaskModel({id: parent_id});
        
                        parent_model.fetch({
                            
                            success: function (parent_model, response, options) {
                                
                               var has_children = Number(parent_model.get("has_children"));
                               
                               if (!has_children) {
                                    var new_val = 1;
                               } else {
                                    var new_val = (has_children) + (1);
                               }
                               
                                parent_model.save({id: parent_model.get("id"), has_children: has_children + 1}, {
                                
                                success: function (parent_model, response) {
                                    
                                    localStorage.setItem("open-sub-task-list-parent-id", parent_model.get("id"));
                                    
                                    new TaskListView();
                                    
                    
                                    }
                                });
                    
                            }
                    
                    });

            }
            
        });

        
  }
  
});
  
  
  
var TaskListChildView = Backbone.View.extend({

  el: $("#task_list_container"),

  tagName: "table",
      
  initialize: function(options){
    
        this.model = new TaskModel();
        this.collection = new TaskCollection();
    
        this.parent_row_id = options.parent_row_id;
        
        this.render();
        
        $(document).bind('click', this.doEdit);
  },
  
  render: function() {
       
        var parent_row = $('tbody[data-id="' + this.parent_row_id + '"]');

        var compiledTemplate = _.template( $("#task-child-list-template").html());
       
        var self = this;    
        var child_task_list_html = [];
	var child_task_list_ids = [];
	
	var new_collection = new TaskCollection();
	
            new_collection.fetch().done(function() {
	      
                    new_collection.each(function(child_task){
        
			  var html = compiledTemplate(child_task.toJSON());
						 
			 if (child_task.toJSON().task_list == localStorage["selected-task-list"]) {              
			     
			      if(child_task.toJSON().parent_id == self.parent_row_id) {
				 child_task_list_html.push(html);
				 child_task_list_ids.push(child_task.toJSON().id);
			      }
			 }
                                           
                        });

      
		    parent_row.append(child_task_list_html);
                    
            });


  },
  
  events: {
    
      "click .complete-sub-task" : "doCompleteSubList",
      "click .delete-sub-task" : "doDeleteSubList",
      "click .inline-sub-edit" : "doInlineSubEdit",
       "click .child-list-item-text" : "activateInlineSubEdit"
    
  },
  
  addChildTask: function(event) {
    
    event.preventDefault();
     event.stopPropagation();

  },
  
      activateInlineSubEdit: function(event) {
        
        event.stopPropagation();
        
        console.log('edit sub task');
        
        var clicked_id = $(event.currentTarget).data('id');
        var get_task = new TaskModel({id: clicked_id});
        
        var result = get_task.fetch({
       
            success: function (get_task, response) {
              
             var current_text = response.name;
             
             $(event.currentTarget)
             .html('<input type="text" class="form-control-inline inline-sub-edit" data-id="' + clicked_id + '" value="' + current_text + '">');
             $('.inline-sub-edit[data-id="' + clicked_id + '"]').focus();
             
             localStorage.setItem("last-sub-task-edited", clicked_id);
            
           }
        
        });
            
          return false;  
    },
  
  
    doInlineSubEdit: function(event) {
        event.stopPropagation();
        
    },
    
     doEdit: function(event) {
        
        event.stopPropagation();
        
         var self = this;

        var last_data_id_edited = localStorage["last-sub-task-edited"];
        var parent_id = $(event.currentTarget).data('parent-id');
        
        if (last_data_id_edited) {
          
            var task_term = $('.inline-sub-edit[data-id="' + last_data_id_edited + '"]').val();
            
            var edit_task = new TaskModel();
            
            edit_task.save({id: last_data_id_edited, name : task_term}, {
            success: function (edit_task, response) {
         
                        //new TaskListView();
                        //new TaskListChildView({parent_row_id: parent_id});
                        //self.render();
                }
            });
        
        }
                
            localStorage.setItem("last-sub-task-edited", "");
    },
    
    doDeleteSubList: function(event) {
   
        
        event.stopPropagation();
        
        var self = this;
        var clicked_id = $(event.currentTarget).data('id');
        var parent_id = $(event.currentTarget).data('parent-id');

        var child_model = new TaskModel({
            id: clicked_id
        });
       
         child_model.destroy({
            
            success: function(child_model, response) {
             
                var parent_model = new TaskModel({id: parent_id});
        
                            parent_model.fetch({
                                
                                success: function (parent_model, response, options) {
                                    
                                var has_children = Number(parent_model.get("has_children"));
   
                                var new_val = (has_children) - (1);

                                    parent_model.save({id: parent_model.get("id"), has_children: new_val}, {
                                    
                                    success: function (parent_model, response) {
                                     
                                                $('.task-child[data-id="' + clicked_id + '"]').remove();
                                                if(new_val == 0) {
                                                    new TaskListView();  
                                                }
                                        }
                                    });
                        
                                }
                        
                        });
            }
        });
    
    },
    
      doCompleteSubList: function(event) {
      
        event.stopPropagation();
        var self = this;
        var clicked_id = $(event.currentTarget).data('id');

        //$('span.list-item-text[data-id="' + clicked_id + '"]').wrap("<strike>")
        //.fadeTo('slow', 0.4);
 
        var complete_task = new TaskModel();
        
        complete_task.save({id: clicked_id, status: 1}, {
        success: function (complete_task, response) {
     
                new TaskListView();

            }
        })
    
    }

  
});
  
  

var TaskListView = Backbone.View.extend({

  el: $("#task_list_container"),

  tagName: "table",
      
  initialize: function(){
  
    this.model = new TaskModel();
    this.collection = new TaskCollection();
    
    $(document).bind('click', this.doEdit);
    
            this.render = _.wrap(this.render, function(render) {
				this.beforeRender();
				render();						
				this.afterRender();
			});						
			
            this.collection.on('change', this.render, this);
            
            this.render();

    },
    
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
    },
		
    afterRender: function () {
        
        var compiledTemplate = _.template( $("#task-list-template").html());
        var self = this;
	var parent_task_list_ids = [];
        var parent_task_list_html = [];
        var parent_ids_with_children = [];
	
        this.collection.comparator = function( model ) {
          return model.get('priority');
        }
        
        this.collection.sort();

            this.collection.fetch().done(function() {
                
                    self.collection.each(function(task){
        
                          var html = compiledTemplate(task.toJSON());
                        
                            if (task.toJSON().task_list == localStorage["selected-task-list"]) {              
                                
                                if(!task.toJSON().parent_id) {
				    parent_task_list_ids.push(task.toJSON().id);
                                    parent_task_list_html.push(html);             
                                } else {
				    parent_ids_with_children.push(task.toJSON().parent_id);
				}
                            }
                                           
                        });
            
                    self.$el.html(parent_task_list_html);
		    
		    self.$el.sortable({
		      
			    items: 'tbody',
			    
                            start: function(event, ui) {
                                var start_pos = ui.item.index();
                                ui.item.data('start_pos', start_pos);
           
                            },
                            update: function (event, ui) {
                             
                            var item_id = ui.item.data('id');
                            var start_pos = ui.item.data('start_pos');
                            var end_pos = ui.item.index();
                            
                            },
                            
                            stop: function(event, ui) {
                            
                                        $(ui.item).siblings().andSelf().each(function() {

                                        var item_id = $(this).attr('data-id');
					
					var item_class = $(this).attr('class');
					
				  
					    var end_pos = $(this).index() + 1;
					    var end_pos_round = pad(end_pos, 2);
						
						    var task_model = new TaskModel();
					    
						    task_model.save({id: item_id, priority : end_pos_round }, {
						    success: function (task_model, response) {
						    
							//console.log(response);
				   
							}
						    });
					    
                                          
					  });
					
                                        new TaskListView();
                                 
                            }
                        
                        
                        });
		    
	      
		  // render the sub task lists
		  var unique_array = Array.from(new Set(parent_ids_with_children));
		  
		  var arrayLength = unique_array.length;
		  for (var i = 0; i < arrayLength; i++) {
		      new TaskListChildView({parent_row_id: unique_array[i]});
		  }

                    
            });
        
                    
                   
        
    },
  
    events: {
        "click .complete_task" : "doComplete",
        "click .uncomplete-task" : "doUnComplete",
        "click .delete_task" : "doDelete",
         "click .add-sub-task" : "doAddSubTask",
        "click .list-item-text" : "activateInlineEdit",
        "click .inline-edit" : "doInlineEdit",
        "click .show-sub-tasks" : "doShowSubTasks"
    },
    
     doOpenActions: function(event) {
        
        //console.log('open actions');
        
        event.stopPropagation();
    
    },
    
      doComplete: function(event) {

        event.stopPropagation();

        var clicked_id = $(event.currentTarget).data('id');

        this.model.save({id: clicked_id, status: 1}, {
        success: function (complete_task, response) {
     
                new TaskListView();

            }
        })
    
    },
    
        doUnComplete: function(event) {
 
        event.stopPropagation();
    
        var clicked_id = $(event.currentTarget).data('id');
 
        this.model.save({id: clicked_id, status: 0}, {
        success: function (complete_task, response) {
     
                new TaskListView();

            }
        })
    
    },
    
    doDelete: function(event) {
        
        //console.log('delete');
        
        event.stopPropagation();
        
        var self = this;
        var clicked_id = $(event.currentTarget).data('id');

        var model = new TaskModel({
            id: clicked_id
        });
       
         model.destroy({
            success: function(model, response) {
             
                   $('.task-tr[data-id="' + clicked_id + '"]').remove();
              
        }
        
        });
    
    },
    
    doAddSubTask: function(event) {
        
        event.stopPropagation();
        
        var clicked_id = $(event.currentTarget).data('id');
        
        new TaskListChildFormView({parent_row_id: clicked_id});
        
        $('.child-task-text').focus();
    },
    
    doShowSubTasks: function(event) {
 
        event.stopPropagation();
        var clicked_id = $(event.currentTarget).data('id');
        
        var child_display = $('.task-child[data-parent-id="' + clicked_id + '"]').css("display");
        
        if(child_display == "none") {
            
            $('.task-child[data-parent-id="' + clicked_id + '"]').removeClass("hide-class");
            $(event.currentTarget).removeClass("fa-plus-circle").addClass("fa-minus-circle");
            
            localStorage.setItem("open-sub-task-list-parent-id", clicked_id);
            
        } else {
            
             $('.task-child[data-parent-id="' + clicked_id + '"]').addClass("hide-class");
             $(event.currentTarget).removeClass("fa-minus-circle").addClass("fa-plus-circle");
            
             localStorage.setItem("open-sub-task-list-parent-id", "");
        }
    },
    
    activateInlineEdit: function(event) {
        
        event.stopPropagation();
        var clicked_id = $(event.currentTarget).data('id');
        var get_task = new TaskModel({id: clicked_id});
        
        var result = get_task.fetch({
       
            success: function (get_task, response) {
              
             var current_text = response.name;
             
             $('span.list-item-text[data-id="' + clicked_id + '"]')
             .html('<input type="text" class="form-control-inline inline-edit" data-id="' + clicked_id + '" value="' + current_text + '">');
             $('.inline-edit[data-id="' + clicked_id + '"]').focus();
             
             localStorage.setItem("last-task-edited", clicked_id);
            
           }
        
        });
            
    },
    
      doInlineEdit: function(event) {
        event.stopPropagation();
        
    },
    
     doEdit: function(event) {
        event.stopPropagation();

        var last_data_id_edited = localStorage["last-task-edited"];
        
        if (last_data_id_edited) {
    
            var task_term = $('.inline-edit[data-id="' + last_data_id_edited + '"]').val();
            
            var edit_task = new TaskModel();
            
            edit_task.save({id: last_data_id_edited, name : task_term}, {
            success: function (edit_task, response) {
         
                new TaskListView();

                }
            });
        
        }
                
            localStorage.setItem("last-task-edited", "");
    }
      
});


var TaskView = Backbone.View.extend({
    
    el: $("#task_container"),
    
    initialize: function(options){

        this.model = new TaskModel();
        this.collection = new TaskCollection();
             
        var do_init = options.do_init;

        if (do_init == true) {

            this.$el.show();
            this.render = _.wrap(this.render, function(render) {
                                    this.beforeRender();
                                    render();						
                                    this.afterRender();
                            });						
                            
            this.render();
            
        } else {
            
            this.$el.hide();
        }


    },
    
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
    },
		
    afterRender: function () {
	
        var template = _.template( $("#task_template").html());
        this.$el.html( template );
    
    },
     
    events: {
        "submit #submit_task": "addTask"
    },
    
    addTask: function(event) {
        
        event.preventDefault();
        
            var new_task = $("#task_input").val();
            var self = this;
            
            var day_month = new Date().toDateString().substring(4);
            
            this.model.save({
                name: new_task,
                status: 0,
                task_list: localStorage["selected-task-list"],
                created: day_month},
                {
                
            success: function (name, response) {
            
                new TaskListView();
               
                $("#task_input").val('');

                }
            })

    }
    
     
});

var TaskSelectorView = Backbone.View.extend({
    
    el: $("#task_selector_container"),
    
    template : _.template( $("#task_selector_template").html()),
           
    initialize: function(){
        
        this.model = new TaskSelectorModel(); 
        this.collection = new TaskSelectorCollection();     
    
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
    
    beforeRender: function(){
            
        var self = this;    
        this.collection.fetch({
                
            success: function (collection, response, options) {
 
                self.$el.html( self.template({collection: self.collection.toJSON() }));
            }
        
        }).done(function() {
            
                if (localStorage["new-task-list"]) {
                    
                    $('#task-list-select').val(localStorage["new-task-list"]).change()
                    .promise().done(function() {
                        localStorage.setItem("new-task-list", "");
                    });
    
                } else if (localStorage["selected-task-list"]) {
                    
                    $('#task-list-select').val(localStorage["selected-task-list"]).change();
    
                } else {
                    
                    $('#task-list-select').val("select_list").change();
                }
                
            
            
            });
           

    },
    
    afterRender: function(){
     
    },
    
    events: {
        "change #task-list-select": "doChangeTaskList",
        "click .open-create-list-input": "doCreateTaskListInput",
        "click .submit-new-list": "doCreateTaskList",
        "click .delete-list": "doDeleteTaskList"
    },
    
    doChangeTaskList: function(event) {
        
        event.preventDefault();
        var selected_list = $(event.currentTarget).find(":selected").val();
        var selected_list_id = $(event.currentTarget).find(":selected").data("id");
        
        if (selected_list == 'create_new_list') {
            var do_init = false;
        } else if (selected_list == 'select_list') {  
            var do_init = false;
        } else {
            var do_init = true;
        }
 
        $('.delete-list').attr('data-id', selected_list_id);
        
        localStorage.setItem("selected-task-list", selected_list);
         
        new TaskView({do_init: do_init});
        new TaskListView();

    },
        
    doCreateTaskListInput: function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        $(event.currentTarget)
        .replaceWith('<input type="text" class="form-control-inline new-list-name" placeholder="Enter name..."><input type="submit" class="submit-new-list pull-right form-inline" value="Submit">');
        
        $('.new-list-name').focus();
    
    },
    
    doCreateTaskList: function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        var new_list_name = $(".new-list-name").val();
        
        var self = this;

           this.model.save({
                name: new_list_name}, {
                
            success: function (name, response) {
            
                localStorage.setItem("new-task-list", new_list_name);
                self.render();
        
                }
            });

    },
    
    doDeleteTaskList: function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        var list_id = $(event.currentTarget).data('id');
        
        var self = this;
        
        var model = new TaskSelectorModel({
            id: list_id
        });
       
         model.destroy({
            success: function(model, response) {
                localStorage.setItem("selected-task-list", "");
                self.render();
                   new TaskView({do_init: false});
        }});

    }
    
     
});


new TaskSelectorView();
