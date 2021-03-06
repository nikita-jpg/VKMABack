// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 100,
        timeWindow: 2000
    }
}

module.exports = {
    method: "GET",
    config: {},
    async execute(fastify, request, reply) {
        try {
            const imageName = request.query.imageName;
            return reply.sendFile(imageName)
        }
        catch (error) {
            console.log(err);
            return fastify.response.All(500, {}, reply);
        }
    }
}
