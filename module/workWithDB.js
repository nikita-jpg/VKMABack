const Sequelize = require("sequelize");
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

//Картинка
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

//Опрос
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

//Вопрос
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

//Вариант ответа
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

//Пользователь
Person = fastify.sequelize.define("Persons",
{
  idPerson: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  isFirstOpen: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
});

//Ответы пользователя на вопросы
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
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

//Конфигурация для связи между объектом и картинкой в бд
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

//Получаем стартовые данные
exports.getEras = async function(userId){

  //Если пользователь есть, то получаем значение isFirstOpen. Если его нет, то создаём
  let isFirstOpen = await Person.findByPk(userId).then(res=>{return res.isFirstOpen}).catch(res=>{return null})
  if(isFirstOpen === null){
    isFirstOpen = true;
    Person.create(
      {
        idPerson: userId,
        isFirstOpen: false
      }
    ).catch(err=>{console.log(err)})
  }

  //Получаем эпохи из БД
  const eras = await Era.findAll({include:[
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

        //Вариант ответа пользователя, если записи нет, то null. За это отвечает required: false
        {model: PersonAnswerOption, as: 'userAnswer', where:{idPerson: userId}, required: false}

      ]},
    ]},

  ]}).then(eras=>{return eras}).catch(eras=>console.log(eras));

  const retJson = {
    isFirstOpen: isFirstOpen,
    eras:Serializer.serializeMany(eras, Era, eraSheme)
  }

  return retJson
}

//Пользователь присылает данные о своём ответе на вопрос
exports.giveAnswer = async function(userId, questionId, answerId){

  const result = await PersonAnswerOption.upsert({
    idPerson:userId,
    idQuestion: questionId,
    idAnswer: answerId
  }).then(res=>{return true}).catch(err=>{console.log(err); return false})
  // const ret = await Image.findAll()
  //                       .then(images=>{return images})
  //                       .catch(images=>console.log(images));
  return result
}
