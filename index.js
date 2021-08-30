const sign = require('./module/sign'); // импорт функции проверки подписи.
const Redis = require('ioredis'); // импорт либы для использования redis.
const redis = new Redis({
    connectionName: process.env.REDIS_CONNECTION_NAME,
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    connectTimeout: +process.env.REDIS_TIMEOUT
})

const fastify = require('fastify')({
    logger: {
        level: 'error',
        file: `log/${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}.log`
    }
});

fastify.register(require('fastify-cors'), {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

fastify.register(require('fastify-formbody'));

fastify.register(require('fastify-rate-limit'),
    {
        global: false, // Не используем глобальные лимиты.
        redis: redis, // Используем redis для хранения данных о лимитах.
        keyGenerator: (request) => {
            // Проверяем подпись параметров запуска.
            // Параметры передаются в header в параметре Authorization
            let param = sign(request.headers.authorization); 
            if (param) {
                request.sign = param;
                return param.vk_user_id;
            } else { return "undefined" }
        },
        errorResponseBuilder: () => { return undefined },
    });

// Автоматический рутинг, основанный на файлах и папках
fastify.register(require('fastify-easy-route'), {
    path: "controllers",
    middleware: './module/middleware'
});

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
