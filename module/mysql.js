'use strict'

const fp = require('fastify-plugin')
const MySQL = require('mysql2')

const { createPool } = MySQL

const fastifyMySQL = (fastify, options, next) => {
    let transporter = null

    try {
        transporter = createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_NAME,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
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
