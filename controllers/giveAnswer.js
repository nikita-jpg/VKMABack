const config = {
    rateLimit: {
        max: 30,
        timeWindow: 5000
    }
}

const bd = require('../module/workWithDB');
module.exports = {
    method: "GET",
    config: config,
    async execute(fastify, request, reply) {
        try {
            const userId = request.body.id;
            const questionId = request.query.questionId;
            const answerId = request.query.answerId;

            console.log(!isNaN(userId))
            console.log(!isNaN(questionId))
            console.log(!isNaN(answerId))

            if(isNaN(userId) || isNaN(questionId) || isNaN(answerId)){
                return fastify.response.All(403, "Access denied", reply)
            }

            const req = await bd.giveAnswer(userId, questionId, answerId)
            return fastify.response.All(200, req, reply)

        }
        catch (error) {
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}