const Sequelize = require("sequelize");
const JSON = require('fast-json-stable-stringify');

let Era;
module.exports.initModels = function(fastify){

    //Пользователь
    Era = fastify.sequelize.define("Eras",
    {
        idEra: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        russianName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        idImageInEras: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      });

    ImageFromDb = fastify.sequelize.define("Images",
    {
        idImage: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        sourceImageLink: {
          type: Sequelize.STRING,
          allowNull: false
        },
        imageName: {
          type: Sequelize.STRING,
          allowNull: false
        }
      });

    Survey = fastify.sequelize.define("Surveys",
    {
        idSurvey: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        russianName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        idEra: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        idImage: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      });

    Question = fastify.sequelize.define("Questions",
    {
      idQuestion: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        textQuestion: {
          type: Sequelize.STRING,
          allowNull: false
        },
        idSurveyInQuestion: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        idImageInQuestion: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      });

    AnswerOption = fastify.sequelize.define("AnswerOptions",
    {
      idAnswerOption: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        idQuestionInAnswer: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        text: {
          type: Sequelize.STRING,
          allowNull: false
        },
        score: {
          type: Sequelize.STRING,
          allowNull: false
        },
        isPersonAnswerd: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        }
      });
    
      Person_Answer = fastify.sequelize.define("Person_Answers",
      {
        idPerson: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
          },        
        idAnswerOption: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false
        }
      });
      
    
          

      ImageFromDb.hasOne(Era,{foreignKey: 'idImageInEras'})
      Era.belongsTo(ImageFromDb,{foreignKey: 'idImageInEras', onUpdate:'CASCADE', onDelete:'NO ACTION'})

      ImageFromDb.hasOne(Question,{foreignKey: 'idImageInQuestion', onUpdate:'CASCADE',onDelete:'CASCADE'})
      Question.belongsTo(ImageFromDb,{foreignKey: 'idImageInQuestion', onUpdate:'CASCADE', onDelete:'NO ACTION'})

      Era.hasMany(Survey, {foreignKey: 'idEra', onUpdate:'CASCADE',onDelete:'CASCADE'})
      Survey.belongsTo(Era,{foreignKey: 'idEra', onUpdate:'CASCADE', onDelete:'NO ACTION'})
      
      ImageFromDb.hasOne(Question,{foreignKey: 'idImageInQuestion', onUpdate:'CASCADE',onDelete:'CASCADE'})
      Question.belongsTo(ImageFromDb,{foreignKey: 'idImageInQuestion', onUpdate:'CASCADE', onDelete:'NO ACTION'})

      Survey.hasMany(Question,{foreignKey: 'idSurveyInQuestion', onUpdate:'CASCADE',onDelete:'CASCADE'})
      Question.belongsTo(Survey,{foreignKey: 'idSurveyInQuestion', onUpdate:'CASCADE', onDelete:'NO ACTION'})

      Question.hasMany(AnswerOption,{foreignKey: 'idQuestionInAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
      AnswerOption.belongsTo(Question,{foreignKey: 'idQuestionInAnswer', onUpdate:'CASCADE', onDelete:'NO ACTION'})

      Person_Answer.belongsToMany(AnswerOption, {through: 'PersonAnswerOptions' })
      AnswerOption.belongsToMany(Person_Answer, {through: 'PersonAnswerOptions' })



      // Survey.belongsTo(Era, {foreignKey: 'idEra', as: 'era'})

    //Прогресс
    // Person_Progress = fastify.sequelize.define("person_progresses",
    // {
    //     survey_prefix: {
    //         type: Sequelize.STRING,
    //         primaryKey: true,
    //         allowNull: false
    //     },
    //     // person_vkId: {
    //     //     type: Sequelize.INTEGER,
    //     //     primaryKey: true,
    //     //     allowNull: false
    //     // },
    //     personProgress: {
    //         type: Sequelize.INTEGER,
    //         allowNull: false
    //     }
    //   })

    // User.hasMany(Person_Progress)
    // Person_Progress.belongsTo(User)
}

exports.getEras = async function(){
  // let firstImage = await ImageFromDb.findByPk('2');
  // firstImage.sourceImageLink = 'Не ссылка на исходник';
  // await firstImage.save();

  // let newFirstImage = await ImageFromDb.findByPk('2');
  // return newFirstImage
  //{include: [{model:Survey, include:{model: Question, include:AnswerOption}}, ImageFromDb]}
  const ret = await Era.findAll()
                        .then(eras=>{return JSON(eras, null, 2)})
                        .catch(eras=>console.log(eras));
  return ret
}

exports.getImages = async function(){
  const ret = await Image.findAll()
                        .then(images=>{return images})
                        .catch(images=>console.log(images));
  return ret
}

exports.getUserById = async function(id){
    const ret = await User.findByPk(id,{raw:true})
                          .then(user=>{return JSON(user, null, 2)})
                          .catch(err=>console.log(err));
    return ret 
}

exports.getUserProgresById = async function(id){

    const user = await User.findAll({where:{vkId:id},include:Person_Progress})
                            // .then(user=>{return user})
                            // .catch(err=>console.log(err));

    if(!user) return console.log("User Not Found")
    // console.log(user)
    console.log(JSON(user, null, 2));


    // const progr = "";
    const progr = await user.getPerson_Progresss()
                            .then(res => {return res})
                            .catch(err=> {return console.log(err)})
            
    return progr 
}