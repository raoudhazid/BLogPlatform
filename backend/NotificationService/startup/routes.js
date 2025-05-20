const express = require("express");
const cors = require("cors");
let swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const articleRoutes = require('../routes/articles');
const commentRoutes = require('../routes/comments');
// Routes


swaggerDocument = require("../swagger-output.json");
module.exports = function (app) {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/articles', articleRoutes );
  app.use('/api/comments', commentRoutes);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  app.use("/public", express.static("public"));
};
