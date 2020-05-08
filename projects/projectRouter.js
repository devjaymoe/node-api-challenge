const express = require('express');
const router = express.Router();
const Projects = require('../data/helpers/projectModel');

router.use(express.json());

router.get('/', (req, res) => {
  Projects.get()
    .then
  res.status(200).json({ message: 'hello from project router' })
})

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'project by id' })
})

router.post('/', (req, res) => {
  res.status(200).json({ message: 'added project to db '})
})

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'project deleted' })
})

router.put('/:id', (req, res) => {
  res.status(200).json({ message: 'project edited with that id' })
})

function validateProjectId(req, res, next) {
  const id = Number(req.params.id)
  if(id && typeof id === 'number'){
    req.user = id
    Users.getById(req.user)
    .then(user => {
      if (user){
          next();
      } else {
          res.status(400).json({ message: 'invalid user id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The users information could not be retrieved.'
      });
    })
  } else {
    res.status(406).json({ message: 'id not valid'})
  }
}

module.exports = router;