const Sequelize = require("sequelize");

let User;
exports.initModels = function(fastify){

    //Пользователь
    User = fastify.sequelize.define("persons",
    {
        vkId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        isFirstOpen: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        }
      }
    )
}

exports.getAllUsers = function(){
    User.findAll({raw:true}).then(users=>{
        console.log(users);
      }).catch(err=>console.log(err));
}