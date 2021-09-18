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
            console.log("sdf")
            const GET_USER = `SELECT * FROM person WHERE vkId = ?;`;
            let id = request.body.id;
            try{
                console.log(test.getAllUsers())
            }catch(err){
                console.log(err)
            }
            
            // const req = await fastify.mysql.query(GET_USER, [id]);
            // console.log(req)
            // const blob = await fastify.mysql.query(GET_IMAGE);
            // let bufferImage = Buffer.from(blob[0][0].content);
            return fastify.response.All(200, req, reply)
            // return reply
            //     .type("image/jpg")
            //     .send(bufferImage)
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