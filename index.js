const logger = require('./module/logger');

const fastify = require('fastify')({
    logger: logger("test_api")
})

fastify.register(require('fastify-formbody'));

// Автоматический рутинг, основанный на файлах и папках
fastify.register(require('fastify-easy-route'));

// Сокращает ответ до fastify.response.All(код, ответ, reply)
fastify.register(require('./module/response'));

// Функция запуска сервера
const start = () => {
    try {
        fastify.listen(process.env.PORT, process.env.IP, (error) => {
            if (error) {
                fastify.log.error(error);
                process.exit(1);
            }
            console.log(`Server listening on http://127.0.0.1:${process.env.PORT}`)
        })
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1)
    }
}
// Запускаем сервер
start()
