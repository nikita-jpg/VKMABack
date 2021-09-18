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

exports.getUserById = async function(id){
    const ret = await User.findByPk(id,{raw:true})
                          .then(user=>{return user})
                          .catch(err=>console.log(err));
    return ret 
}