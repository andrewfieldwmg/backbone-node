var utils = {};

utils.flatten = arr => arr.reduce(
     (a, b) => a.concat(Array.isArray(b) ? utils.flatten(b) : b), []
    );

utils.colors = ['lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 
    'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategrey', 'lightsteelblue', 'lightyellow', 
    'aquamarine'];

    
utils.getRandomColour = utils.colors[Math.floor(Math.random()*utils.colors.length)];
    
        
    /*function deleteFromArray(my_array, element) {
      position = my_array.indexOf(element);
      my_array.splice(position, 1);
    }*/
      
          
utils.getExtension = function(filename) {
        return filename.split('.').pop();
    }
    
module.exports = utils;