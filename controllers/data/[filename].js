module.exports = {
    method: "GET",
    auth: true,
    admin: false,
    config: {},
    async execute(fastify, request, reply) {
        try {
            const imageName = request.params.filename;
            return reply.sendFile(imageName)
        }
        catch (error) {
            console.log(err);
            return fastify.response.All(500, {}, reply);
        }
    }
}