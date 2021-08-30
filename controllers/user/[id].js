
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
                fastify.response.All(200, users[id], reply)
            }
            else {
                fastify.response.All(404, "Not Found123", reply)
            }
        }
        catch (error) {
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}