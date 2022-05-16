const config = {
  rateLimit: {
    max: 10,
    timeWindow: 5000,
  },
};

const bd = require("../module/workWithDB");
module.exports = {
  method: "POST",
  config: config,
  async execute(fastify, request, reply) {
    try {
      // const userId = Number(request.body.id);
      console.log(request.body);
      const data = request.body;
      //   const userInfo = request.body.useZakaz;

      // if(isNaN(userId) || !Array.isArray(userInfo.userAnswers)){
      //     return fastify.response.All(403, "Access denied", reply)
      // }

      await bd
        .addZakaz(
          data.name,
          data.address,
          data.fhoneNumber,
          data.date,
          data.timeStart,
          data.timeEnd,
          data.comment
        )
        .then(() => fastify.response.All(200, "saved", reply))
        .catch(() => fastify.response.All(500, "This is very bad =(", reply));

      // if(isClearUserSurveyAnswers){
      //     const userAnswers = userInfo.userAnswers;
      //     for(let i=0;i<userAnswers.length;i++){
      //         if(!await bd.giveAnswer(userId,userAnswers[i].idSurvey, userAnswers[i].idQuestion, userAnswers[i].idAnswerOption)){
      //             fastify.response.All(500, "This is very bad =(", reply)
      //         }
      //     }
      // }else{
      //     fastify.response.All(500, "This is very bad =(", reply)
      // }

      //   return fastify.response.All(200, "saved", reply);
    } catch (error) {
      console.log(error);
      fastify.response.All(500, "This is very bad =(", reply);
    }
  },
};
