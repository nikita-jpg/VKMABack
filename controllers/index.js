// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 10,
        timeWindow: 5000
    }
}

const bd = require('../module/workWithDB');
module.exports = {
    method: "GET",
    config: config,
    async execute(fastify, request, reply) {
        try {
            const userId = Number(request.body.id);

            if(isNaN(userId)){
                return fastify.response.All(403, "Access denied", reply)
            }

            const req = await bd.getStartDate(userId)
            return fastify.response.All(200, req, reply)
        }
        catch (error) {
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}
