const express = require("express");
const userController = require("./src/controllers/usersController");
const postController = require("./src/controllers/postController");
const mongoose = require('mongoose');
// const accountsController = require("./src/controllers/accountsController");


const app = express();
app.use(express.json({ limit: '50mb' }));
require("dotenv").config();

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Headers,Content-Type,Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});


//test call
app.get("/", (req, res) => res.send("Server Running"))

//User Routes
app.post("/api/user", userController.addUser);
app.get("/api/user/:userId", userController.cacheMiddleware, userController.getUser);
app.patch("/api/user/:userId", userController.UpdateUser);

//accounts Routes
app.post("/api/post", postController.addPost);
app.get("/api/post/:postId",postController.cacheMiddleware, postController.getPostById);
app.patch("/api/post/:postId", postController.UpdatePost);
app.get("/api/post/:userId/posts",userController.cacheMiddleware, postController.getPostsByUserId);

app.listen(process.env.PORT || 5000, async () => {
  mongoose.connect('mongodb://localhost/efuse')
  .then(()=>console.log('Db Connected'))
  .catch(()=>console.log('Db Connection Error'))
});
