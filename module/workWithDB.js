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
UsersAbswers = fastify.sequelize.define("UsersAbswers",
{
  idPerson: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  idSurvey: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
  idQuestion: {
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

//Конфигурация для связи между объектом и картинкой в бд
const configForImage = {
  foreignKey: 'imageName',
  as:'image',
  onUpdate:'CASCADE', 
  onDelete:'NO ACTION'
}
//Сделать!!!!, выше готово!!!!
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

//Опрос и ответ пользователя
Survey.hasMany(UsersAbswers,{foreignKey: 'idSurvey', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
UsersAbswers.belongsTo(Survey,{foreignKey: 'idSurvey'})



//Вопрос и варианты ответа
Question.hasMany(AnswerOption,{foreignKey: 'idQuestion', as:'answerOptions', onUpdate:'CASCADE',onDelete:'CASCADE'})
AnswerOption.belongsTo(Question,{foreignKey: 'idQuestion'})

//Вопрос и ответ пользователя
Question.hasOne(UsersAbswers,{foreignKey: 'idQuestion', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
UsersAbswers.belongsTo(Question,{foreignKey: 'idQuestion'})




//Варианты ответа и ответ пользователя
AnswerOption.hasOne(UsersAbswers,{foreignKey: 'idAnswerOption', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
UsersAbswers.belongsTo(AnswerOption,{foreignKey: 'idAnswerOption'})

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

const erasSheme = {
    include: ['@all', 'image'],
    exclude: ['imageName'],
    assoc:{
      image:{
        include:['imageName','sourceImageLink']
      }
    }
}
const surveysSheme = {
  include: ['@all', 'image'],
  exclude: ['imageName'],
  assoc:{
    image:{
      include:['imageName','sourceImageLink']
    }
  }
}

//Получаем эры
getEras = async function(){
  const eras = await Era
  .findAll({include:{model: ImageFromDb, as: 'image'}})
  .then(eras=>{return eras})
  .catch(eras=>console.log(eras));


  return Serializer.serializeMany(eras, Era, erasSheme)
}
//Получаем опросы
getSurveys = async function(){
  const survey = await Survey
  .findAll({include:{model: ImageFromDb, as: 'image'}})
  .then(surveys=>{return surveys})
  .catch(surveys=>console.log(surveys));


  return Serializer.serializeMany(survey, Survey, surveysSheme)
}



exports.getStartDate = async function(){

  const eras = await getEras()
  const surveys = await getSurveys()

  return{
    Eras:eras,
    Surveys:surveys
  }
}

//Получаем стартовые данные
// exports.getEras = async function(userId){

//   //Если пользователь есть, то получаем значение isFirstOpen. Если его нет, то создаём
//   let isFirstOpen = await Person.findByPk(userId).then(res=>{return res.isFirstOpen}).catch(res=>{return null})
//   if(isFirstOpen === null){
//     isFirstOpen = true;
//     Person.create(
//       {
//         idPerson: userId,
//         isFirstOpen: false
//       }
//     ).catch(err=>{console.log(err)})
//   }

  //Получаем эпохи из БД
//   const eras = await Era.findAll({include:[
//     //Эпоха
//     {model: ImageFromDb, as: 'image'},
//     // //Опросы
//     // {model: Survey, as: 'surveys', include:[

//     //   //Картинка опроса
//     //   {model: ImageFromDb, as: 'image'},

//     //   //Вопросы
//     //   {model: Question, as: 'questions',include:[
        
//     //     {model: ImageFromDb, as: 'image'},

//     //     //Варианты ответа
//     //     {model: AnswerOption, as: 'answerOptions'},

//     //     //Вариант ответа пользователя, если записи нет, то null. За это отвечает required: false
//     //     {model: PersonAnswerOption, as: 'userAnswer', where:{idPerson: userId}, required: false}

//     //   ]},
//     // ]},

//   ]}).then(eras=>{return eras}).catch(eras=>console.log(eras));

//   const retJson = {
//     isFirstOpen: isFirstOpen,
//     eras:Serializer.serializeMany(eras, Era, eraSheme)
//   }

//   return retJson
// }

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
