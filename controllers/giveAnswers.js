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
            const userId = request.body.id;
            const userAnswers = request.body.userAnswers;

            if(isNaN(userId) || !Array.isArray(userAnswers)){
                return fastify.response.All(403, "Access denied", reply)
            }

            for(let i=0;i<userAnswers.length;i++){
                if(!await bd.giveAnswer(userId, userAnswers[i].idQuestion, userAnswers[i].userAnswer.idAnswerOption)){
                    fastify.response.All(500, "This is very bad =(", reply)
                }
            }


            return fastify.response.All(200, "saved", reply)

        }
        catch (error) {
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}