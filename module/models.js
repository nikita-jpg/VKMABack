const Sequelize = require("sequelize");
const JSON = require('fast-json-stable-stringify');
const Serializer = require('sequelize-to-json');

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
        imageName: {
          type: Sequelize.STRING,
          allowNull: false
        }
      });

    ImageFromDb = fastify.sequelize.define("Images",
    {
      imageName: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        sourceImageLink: {
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
        imageName: {
          type: Sequelize.STRING,
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
      idSurvey: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      imageName: {
        type: Sequelize.STRING,
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
        idQuestion: {
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

    Person = fastify.sequelize.define("Persons",
    {
      idPerson: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        isFirstOpen: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        }
    });

    PersonAnswerOption = fastify.sequelize.define("PersonAnswerOptions",
    {
      idPerson: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        idQuestion: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        idAnswer: {
          type: Sequelize.STRING,
          allowNull: false
        }
    });
      
const configForImage = {
  foreignKey: 'imageName',
  as:'image',
  onUpdate:'CASCADE', 
  onDelete:'NO ACTION'
}

//Картинка и эпоха
ImageFromDb.hasOne(Era,{foreignKey: 'imageName'})
Era.belongsTo(ImageFromDb,{...configForImage})

//Картинка и опрос
ImageFromDb.hasOne(Survey,{foreignKey: 'imageName'})
Survey.belongsTo(ImageFromDb,{...configForImage})

//Картинка и вопрос
ImageFromDb.hasOne(Question,{foreignKey: 'imageName'})
Question.belongsTo(ImageFromDb,{...configForImage})

//Эпоха и опрос
Era.hasMany(Survey, {foreignKey: 'idEra', as:'surveys', onUpdate:'CASCADE',onDelete:'CASCADE'})
Survey.belongsTo(Era,{foreignKey: 'idEra'})

//Опрос и вопрос
Survey.hasMany(Question,{foreignKey: 'idSurvey', as:'questions', onUpdate:'CASCADE',onDelete:'CASCADE'})
Question.belongsTo(Survey,{foreignKey: 'idSurvey'})

//Вопрос и варианты ответа
Question.hasMany(AnswerOption,{foreignKey: 'idQuestion', as:'answerOptions', onUpdate:'CASCADE',onDelete:'CASCADE'})
AnswerOption.belongsTo(Question,{foreignKey: 'idQuestion'})

//Вопрос и ответ пользователя
Question.hasOne(PersonAnswerOption,{foreignKey: 'idQuestion', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
PersonAnswerOption.belongsTo(Question,{foreignKey: 'idQuestion'})
// Person.belongsToMany(Question,{through: 'PersonAnswerOptions', foreignKey: 'idPerson'})

// Person_Answer.belongsToMany(AnswerOption, {through: 'PersonAnswerOptions' })
// AnswerOption.belongsToMany(Person_Answer, {through: 'PersonAnswerOptions' })



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

const eraSheme = {

  //Эпоха
  include: ['@all', 'image', 'surveys'],
  exclude: ['@pk','@fk'],
  assoc:{
    image:{
      include:['imageName','sourceImageLink']
    },

    //Опросы
    surveys:{
      include: ['@all', 'image', 'questions'],
      exclude: ['@pk','@fk'],
      assoc:{

        image:{
          include:['imageName','sourceImageLink']
        },
  
        //Вопросы
        questions:{
          include: ['@all', 'image', 'answerOptions', 'userAnswer'],
          exclude: ['idSurvey','imageName'],
          assoc:{

            image:{
              include:['imageName','sourceImageLink']
            },

            //Варианты ответа
            answerOptions:{
              include: ['@all']
            },

            //Вариант ответа пользователя
            userAnswer:{
              include:['idAnswer']
            }
            
          }
        }
      }
    }
  }
}

exports.getEras = async function(userId){
  // let firstImage = await ImageFromDb.findByPk('2');
  // firstImage.sourceImageLink = 'Не ссылка на исходник';
  // await firstImage.save();

  // let newFirstImage = await ImageFromDb.findByPk('2');
  // return newFirstImage
  //{include: [{model:Survey, include:{model: Question, include:AnswerOption}}, ImageFromDb]}
  const ret = await Era.findAll({include:[

    //Эпоха
    {model: ImageFromDb, as: 'image'},

    //Опросы
    {model: Survey, as: 'surveys', include:[

      //Картинка опроса
      {model: ImageFromDb, as: 'image'},

      //Вопросы
      {model: Question, as: 'questions',include:[
        
        {model: ImageFromDb, as: 'image'},

        //Варианты ответа
        {model: AnswerOption, as: 'answerOptions'},

        //Вариант ответа пользователя
        {model: PersonAnswerOption, as: 'userAnswer', where:{idPerson:userId}}

      ]},
    ]},

  ]}).then(eras=>{
    let postsAsJSON = Serializer.serializeMany(eras, Era, eraSheme);
    console.log(postsAsJSON)
    return postsAsJSON
  })
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