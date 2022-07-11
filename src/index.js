const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");

const config = require("./config/config");
const postRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: config.REDIS_URL,
  port: config.REDIS_PORT,
});

const mongoUrl = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Succesfully connected to mongo"))
  .catch((e) => console.log(e));

const app = express();

app.enable("trust proxy");
app.use(cors());

app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: config.SESSION_SECRET,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 3000000,
    },
  })
);

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", authRouter);

app.get("/api", (req, res) => {
  res.send("<h2>Hi There!!!</h2>");
  console.log("yeah it ran");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server listening on port ${port}`));
