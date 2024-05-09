import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { get404 } from "./controllers/error";
import {sequelize} from "./util/database";
import User from "./models/user";

import blogRoutes from "./routes/blog";
import Blog from "./models/blog";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(express.static(path.join(__dirname, "../", "public")));

app.use((req: Request, res: Response, next: NextFunction) => {
  User.findByPk(1)
    .then((user) => {
      if (user !== null) {
        req.body = {
          ...req.body,
          user
        }
      }
      next();
    })
    .catch(err => console.log(err));
});

// setting required headers and resolving CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next();
})

app.use("/blogs", blogRoutes);

app.use(get404);

Blog.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(Blog);

// special middleware - used only for error handling
// we can multiple error handling middlewares, they run from top to bottom
// express handles errors when return next(error) is written in catch block or put it in another way
// inside of async we must use next(err) & return and outside of async we can directly throw err; and it will reach this handler
app.use(errorMiddleware);

sequelize
  // to force truncate and create tables again
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Test", email: "test@test.com" });
    }
    return Promise.resolve(user);
  })
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => console.log(err));
