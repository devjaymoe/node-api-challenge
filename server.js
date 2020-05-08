const express = require('express');
const server = express();
const ProjectRouter = require('./projects/projectRouter');
const ActionsRouter = require('./actions/actionsRouter');

server.use(express.json());
server.use(logger)

server.use('/projects', ProjectRouter);
server.use('/actions', ActionsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Welcome to this sprint challenge!</h2>`);
});

//custom middleware

function logger(req, res, next) {

  const today = new Date().toLocaleDateString('en-US');
  console.log(`Date: ${today}, Request Method: ${req.method}, Url: ${req.url}`)

  next();
}

module.exports = server;