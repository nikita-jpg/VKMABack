module.exports = {
  async execute(fastify, command, request, reply) {
    console.log(request)
    try {
      // Получение id из объекта sign который 
      // был инициализирован после проверки подписи
      let id = request?.sign.vk_user_id;
      //
      let _auth = command?.auth; // true
      let _root = command?.root; // true
      console.log(id)
      if (id && _auth) {
          // Получение данных о пользователе с бд или любого хранилища ... 
          let user = { name: "Artur Frank", root: 1 };
          //
          
          if (!_root || user.role == _root) { request.body = { ...{ id: id }, ...request.body }; }
          else { return fastify.response.All(403, { message: `403 Forbidden` }, reply); }
      }
      else {return fastify.response.All(400, { message: `400 Bad Request` }, reply);}
    }
    catch (error) {
      fastify.log.error(error);
      return fastify.response.All(500, { message: `500 Internal Server Error` }, reply);
    }
 }
}