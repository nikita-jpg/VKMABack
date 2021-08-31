module.exports = {
    method: "GET",
    auth: false,
    admin: false,
    config: {},
    async execute(fastify, request, reply) {
        console.log("1651")
        try {
            let a = request.params.filename;
            console.log(a)
            return reply.sendFile(a)
        }
        catch (error) {
            console.log(err);
            return fastify.response.All(500, {}, reply);
        }
    }
}