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
  idUser: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  isFirstOpen: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
});

//Ответы пользователя на вопросы
UserAnswers = fastify.sequelize.define("UserAnswers",
{
  idUser: {
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
      primaryKey: false,
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
Survey.hasMany(UserAnswers,{foreignKey: 'idSurvey', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
UserAnswers.belongsTo(Survey,{foreignKey: 'idSurvey'})



//Вопрос и варианты ответа
Question.hasMany(AnswerOption,{foreignKey: 'idQuestion', as:'answerOptions', onUpdate:'CASCADE',onDelete:'CASCADE'})
AnswerOption.belongsTo(Question,{foreignKey: 'idQuestion'})

//Вопрос и ответ пользователя
Question.hasOne(UserAnswers,{foreignKey: 'idQuestion', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
UserAnswers.belongsTo(Question,{foreignKey: 'idQuestion'})




// //Варианты ответа и ответ пользователя
// AnswerOption.hasOne(UserAnswers,{foreignKey: 'idAnswerOption', as:'userAnswer', onUpdate:'CASCADE',onDelete:'CASCADE'})
// UserAnswers.belongsTo(AnswerOption,{foreignKey: 'idAnswerOption'})

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


const defaultSheme = {
  include: ['@all', 'image'],
  exclude: ['imageName'],
  assoc:{
    image:{
      include:['imageName','sourceImageLink']
    }
  }
}
const answerOptionSheme = {
  include: ['@all']
  // exclude: ['imageName'],
  // assoc:{
  //   image:{
  //     include:['imageName','sourceImageLink']
  //   }
  // }
}
const userAnswersSheme = {
  include: ['@all'],
  exclude: ['idUser'],
  // assoc:{
  //   image:{
  //     include:['imageName','sourceImageLink']
  //   }
  // }
}


getUserData = async function(idUser){
  const user =  await Person
  .findByPk(idUser)
  .then(user=>{return user})
  .catch(user=>console.log(user));

  if(user.isFirstOpen === 1){
    await Person.upsert({
      idUser:idUser,
      isFirstOpen:false
    }).then(res=>{return true}).catch(err=>{console.log(err); return false})
  }

  return Serializer.serializeMany([user], Person, userAnswersSheme)[0]
}

//Получаем эры
getEras = async function(){
  const eras = await Era
  .findAll({include:{model: ImageFromDb, as: 'image'}})
  .then(eras=>{return eras})
  .catch(eras=>console.log(eras));


  return Serializer.serializeMany(eras, Era, defaultSheme)
}
//Получаем опросы
getSurveys = async function(){
  const surveys = await Survey
  .findAll({include:{model: ImageFromDb, as: 'image'}})
  .then(surveys=>{return surveys})
  .catch(surveys=>console.log(surveys));


  return Serializer.serializeMany(surveys, Survey, defaultSheme)
}
//Получаем вопросы
getQuestions = async function(){
  const questions = await Question
  .findAll({include:{model: ImageFromDb, as: 'image'}})
  .then(questions=>{return questions})
  .catch(questions=>console.log(questions));


  return Serializer.serializeMany(questions, Question, defaultSheme)
}
//Получаем варианты ответов
getAnswerOptions = async function(){
  const answerOptions = await AnswerOption
  .findAll()
  .then(answerOptions=>{return answerOptions})
  .catch(answerOptions=>console.log(answerOptions));


  return Serializer.serializeMany(answerOptions, AnswerOption, answerOptionSheme)
}

//Получаем ответы пользователя
getUserAnswers = async function(idUser){
  const userAnswers = await UserAnswers
  .findAll({where:{idUser: idUser}, required: false})
  .then(answerOptions=>{return answerOptions})
  .catch(answerOptions=>console.log(answerOptions));


  return Serializer.serializeMany(userAnswers, UserAnswers, userAnswersSheme)
}

sendStartData = async function(idUser){
  const userData = await getUserData(idUser)
  const eras = await getEras()
  const surveys = await getSurveys()
  const questions = await getQuestions()
  const answerOptions = await getAnswerOptions()
  const userAnswers = await getUserAnswers(idUser)

  return{
    UserData:userData,
    Eras:eras,
    Surveys:surveys,
    Questions:questions,
    AnswerOptions:answerOptions,
    UserAnswers:userAnswers
  }
}

exports.getStartDate = async function(userId){

  let ret;

  //Если пользователь есть, то получаем значение isFirstOpen. Если его нет, то создаём
  let user = await Person.findByPk(userId)
  .then(res=>{return res})
  .catch(res=>{console.log(res + "err"); return null})
  if(user === null){
    await Person.create(
      {
        idUser: userId,
        isFirstOpen: true
      }
    )
    .then(res=>{
      ret = sendStartData(userId)
    })
    .catch(err=>{console.log(err + " err")})
  }else{
    ret = sendStartData(userId)
  }


  // const userData = await getUserData(userId)
  // const eras = await getEras()
  // const surveys = await getSurveys()
  // const questions = await getQuestions()
  // const answerOptions = await getAnswerOptions()
  // const userAnswers = await getUserAnswers(userId)

  return ret
  // return{
  //   UserData:userData,
  //   Eras:eras,
  //   Surveys:surveys,
  //   Questions:questions,
  //   AnswerOptions:answerOptions,
  //   UserAnswers:userAnswers
  // }
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
exports.giveAnswer = async function(userId, surveyId, questionId, answerId){
  const result = await UserAnswers.upsert({
    idUser:userId,
    idSurvey:surveyId,
    idQuestion: questionId,
    idAnswerOption: answerId
  }).then(res=>{return true}).catch(err=>{console.log(err); return false})

  return result
}
