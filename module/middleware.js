module.exports = {
  async execute(fastify, command, request, reply) {
    try {
      // Получение id из объекта sign который 
      // был инициализирован после проверки подписи
      // let id = request?.sign.vk_user_id;
      // request.body = { ...{ id: id }, ...request.body };

      // let _auth = command?.auth; // true
      // if (id && _auth) {
      //   request.body = { ...{ id: id }, ...request.body };
      // }
      // else {return fastify.response.All(400, { message: `400 Bad Request` }, reply);}
    }
    catch (error) {
      console.log(error)
      fastify.log.error(error);
      return fastify.response.All(500, { message: `500 Internal Server Error` }, reply);
    }
 }
}



// module.exports = {
//   async execute(fastify, command, request, reply) {
//     try {
//         request.body = { ...{ id: id }, ...request.body };
//     }
//     catch (error) {
//       fastify.log.error(error);
//       return fastify.response.All(500, { message: `500 Internal Server Error` }, reply);
//     }
//  }
// }