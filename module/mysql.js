'use strict'

const fp = require('fastify-plugin')
const MySQL = require('mysql2')

const { createPool } = MySQL

const fastifyMySQL = (fastify, options, next) => {
    let transporter = null

    try {
        transporter = createPool({
            host: "127.0.0.1",
            port: "3307",
            user: "root",
            database: "vkma_db",
            password: "toor",
            charset: 'utf8mb4',
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
        }).promise();
    } catch (err) {
        return next(err)
    }

    fastify
        .decorate('mysql', transporter)
        .addHook('onClose', close)

    next()
}

const close = (fastify, done) => {
    fastify.mysql.close(done)
}

module.exports = fp(fastifyMySQL, {
    fastify: '>=2.0.0',
    name: 'fastify-mysql2'
})
