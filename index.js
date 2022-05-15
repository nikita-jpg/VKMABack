const sign = require("./module/sign"); // импорт функции проверки подписи.
const Redis = require("ioredis"); // импорт либы для использования redis.

const redis = new Redis({
  connectionName: "RAID_LIMIT",
  host: "localhost",
  port: +6379,
  connectTimeout: +500,
});

const fastify = require("fastify")({
  logger: {
    level: "info",
    file: `log/${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}.log`,
  },
});

fastify.register(require("fastify-cors"), {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
});

fastify.register(require("fastify-formbody"));

fastify.register(require("fastify-rate-limit"), {
  global: false, // Не используем глобальные лимиты.
  redis: redis, // Используем redis для хранения данных о лимитах.
  keyGenerator: (request) => {
    // Проверяем подпись параметров запуска.
    // Параметры передаются в header в параметре Authorization

    if (request.headers.authorization === "12345") {
      request.isForKursach = true;
      return null;
    }

    let param = sign(request.headers.authorization);
    console.log(request.headers);
    if (param) {
      request.sign = param;
      return param.vk_user_id;
    } else {
      return "undefined";
    }
  },
  errorResponseBuilder: () => {
    return undefined;
  },
});

// Сокращает ответ до fastify.response.All(код, ответ, reply)
fastify.register(require("./module/response"));

// Рукописный плагин для работы с бд
fastify.register(require("./module/mysql"));

// Для отправки статики
const path = require("path");
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "images"), // images - расположение папки со статикой отнносительно папки с текущим файлом (то есть с папки с index.js)
});

fastify
  .register(require("sequelize-fastify"), {
    instance: "sequelize",
    sequelizeOptions: {
      dialect: "mysql",
      database: "vkma_db",
      username: "root",
      password: "toor",
      host: "127.0.0.1",
      port: "3306",
      logging: false,
      define: {
        timestamps: false,
      },
    },
  })
  .ready(async () => {
    try {
      // Инициализация моделей
      const initModels = require("./module/workWithDB");
      try {
        initModels.initModels(fastify);
        fastify.sequelize
          .sync()
          .then((result) => {
            // console.log(result);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  });

// fastify.get("/", async (request, reply) => {
//   return { hello: "world" };
// });

// // Автоматический рутинг, основанный на файлах и папках
fastify.register(require("fastify-easy-route"), {
  path: "controllers",
  middleware: "./module/middleware",
});

// Функция запуска сервера
const start = () => {
  try {
    fastify.listen(18301, "0.0.0.0", (error) => {
      if (error) {
        fastify.log.error(error);
        process.exit(1);
      }
      console.log(`Server listening on http://127.0.0.1:18301`);
    });
  } catch (error) {
    console.log(error);
    fastify.log.error(error);
    process.exit(1);
  }
};
// Запускаем сервер
start();
