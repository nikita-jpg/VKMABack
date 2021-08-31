
// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 10,
        timeWindow: 5000
    }
}

const GET_IMAGE = `SELECT content FROM images WHERE id = 7`;

module.exports = {
    method: "GET",
    auth: true,
    root: false,
    config: config,
    async execute(fastify, request, reply) {
        try {
            const blob = await fastify.mysql.query(GET_IMAGE);
            let bufferImage = Buffer.from(blob[0][0].content);
            return reply
                .type("image/jpg")
                .send(bufferImage)
        }
        catch (error) {
            console.log(error)
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}

// Такой формат уменьшает вероятность sql-инъекции
// const GET_USER = `SELECT * FROM users WHERE id = ? AND role = ?;`;

// await fastify.mysql.query(GET_USER, [_user_id, user.role]);