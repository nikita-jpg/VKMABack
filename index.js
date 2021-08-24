const fastify = require('fastify')({ logger: true })
fastify.register(require('fastify-formbody'));

// Создаем первый маршрут
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

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