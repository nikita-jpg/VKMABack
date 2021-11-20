const config = {
    rateLimit: {
        max: 30,
        timeWindow: 5000
    }
}

const bd = require('../module/workWithDB');
module.exports = {
    method: "POST",
    config: config,
    async execute(fastify, request, reply) {
        try {
            const userId = Number(request.body.id);
            const userInfo = request.body.userAnswers;

            if(isNaN(userId) || !Array.isArray(userInfo.userAnswers)){
                return fastify.response.All(403, "Access denied", reply)
            }


            const isClearUserSurveyAnswers = await bd.clearUserSurveyAnswers(userId, userInfo.surveyId)

            if(isClearUserSurveyAnswers){
                const userAnswers = userInfo.userAnswers;
                for(let i=0;i<userAnswers.length;i++){
                    if(!await bd.giveAnswer(userId,userAnswers[i].idSurvey, userAnswers[i].idQuestion, userAnswers[i].idAnswerOption)){
                        fastify.response.All(500, "This is very bad =(", reply)
                    }
                }
            }else{
                fastify.response.All(500, "This is very bad =(", reply)
            }

            return fastify.response.All(200, "saved", reply)

        }
        catch (error) {
            console.log("GiveAnswer Error")
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}