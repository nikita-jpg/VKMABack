// 10 запросов в 5 секунд
const config = {
    rateLimit: {
        max: 100,
        timeWindow: 5000
    }
}

const test = require('../module/models');
const GET_IMAGE = `SELECT content FROM images WHERE id = 7`;
// fastify.register(require('mysql'));
// const mysql = require('../module/mysql'); // импорт функции проверки подписи.
module.exports = {
    method: "GET",
    auth: true,
    root: false,
    config: config,
    async execute(fastify, request, reply) {
        try {
            const userId = request.body.id;

            if(!isNaN(userId)){
                return fastify.response.All(403, "Access denied", reply)
            }
            // const req = await test.giveAnswer(10,2,1)
            const req = await test.getEras(userId)
            console.log("sdlmdslkmfklewdfmwlEKMD")
            return fastify.response.All(200, req, reply)

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