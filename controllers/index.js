
// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 1,
        timeWindow: 1000 * 60
    }
}

module.exports = {
    method: "GET",
    // auth: true,
    // root: true,
    // config: config,
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