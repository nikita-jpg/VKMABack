'use strict'

const fp = require('fastify-plugin');

const response = {
    async All(Code, Data, reply) {
        reply
            .code(Code)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(Data);
    }
}

module.exports = fp((fastify, options, next) => {
    fastify
        .decorate('response', response)
        .addHook('onClose', (fastify, done) => {
            fastify.response.close(done)
        }); next();
}, {
    fastify: '>=3.0.0',
    name: 'fastify-response'
})

// module.exports = function (fastify, opts, done) {
//     fastify.decorate('utility', () => {})
  
//     fastify.get('/', handler)
  
//     done()
//   }