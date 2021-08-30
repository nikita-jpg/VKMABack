
// 10 запросов в 5 секунд
module.exports = {
    method: "GET",
    config: {
        rateLimit: {
            max: 10,
            timeWindow: 5000
        }
    },
    async execute(fastify, request, reply) {
        try {
            reply
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ message: "I'm super api" });
        }
        catch (error) {
            reply
                .code(500)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ message: "This is very bad =(" });
        }
    }
}