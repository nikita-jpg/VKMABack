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
            console.log(request.body.userAnswers)
            const userAnswers = request.body.userAnswers;


            // const questionId = request.body.userAnswer.questionId;
            // const answerId = request.query.answerId;

            // console.log(!isNaN(userId))
            // console.log(!isNaN(questionId))
            // console.log(!isNaN(answerId))

            if(isNaN(userId) || isNaN(userAnswers)){
                return fastify.response.All(403, "Access denied", reply)
            }

            // const req =""

            const req = userAnswers.map((answer)=>{
                await bd.giveAnswer(userId, answer.idQuestion, answer.userAnswer.idAnswerOption)
            })

            return fastify.response.All(200, req, reply)

        }
        catch (error) {
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}