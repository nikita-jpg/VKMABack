// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 100,
        timeWindow: 5000
    }
}

const bd = require('../module/models');
module.exports = {
    method: "GET",
    auth: true,
    root: false,
    config: config,
    async execute(fastify, request, reply) {
        try {
            const userId = request.body.id;

            if(isNaN(userId)){
                return fastify.response.All(403, "Access denied", reply)
            }

            const req = await bd.getEras(userId)
            return fastify.response.All(200, req, reply)
        }
        catch (error) {
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}
