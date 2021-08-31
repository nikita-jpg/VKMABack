
// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 10,
        timeWindow: 5000
    }
}

module.exports = {
    method: "GET",
    auth: true,
    root: false,
    config: config,
    async execute(fastify, request, reply) {
        try {
            fastify.response.All(200, "I'm super api", reply)
        }
        catch (error) {
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}

// Такой формат уменьшает вероятность sql-инъекции
// const GET_USER = `SELECT * FROM users WHERE id = ? AND role = ?;`;

// await fastify.mysql.query(GET_USER, [_user_id, user.role]);