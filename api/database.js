var Sequelize = require('sequelize');    
var env = "production";
var config = require('./database.json')[env];
var password = config.password ? config.password : null;

    // initialize database connection
        var sequelize = new Sequelize(
                config.database,
                config.user,
                config.password,
                {
                        //logging: console.log,
                        define: {
                                timestamps: false
                        }
                }
        );
              
        module.exports = sequelize;