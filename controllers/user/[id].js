module.exports = {
    method: "GET",
    async execute(fastify, request, reply) {
        try {
            // Получаем id
            let id = request.params?.id;
            // Тут может быть запрос к БД. Для примера маленький массив
            let users = [
                { name: "Антон", sex: 2},
                { name: "Артур", sex: 2},
                { name: "Алиса", sex: 1}
            ]
            
            // Проверяем не передали ли нам отрицательное число, 
            // либо id больше того который у нас есть
            if(id >= 0 && id <= users.length - 1){
                reply
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(users[id]);
            }
            else {
                reply
                .code(404)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send("Not Found");
            }
        }
        catch (error) {
            reply
                .code(500)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send("This is very bad =(");
        }
    }
}