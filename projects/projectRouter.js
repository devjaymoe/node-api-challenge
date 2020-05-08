const express = require('express');
const router = express.Router();
const Projects = require('../data/helpers/projectModel');

router.use(express.json());

router.get('/', (req, res) => {
  Projects.get()
    .then( response => {
      res.status(200).json({ message: 'success!', data: response})
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({
          message: 'The project data could not be retrieved.'
      });
    });
});

router.get('/:id', validateProjectId, (req, res) => {
  const id = req.params.id
  Projects.get(id)
    .then( response => {
      res.status(200).json({ message: 'success!', data: response})
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({
          message: 'The project data could not be retrieved.'
      });
    });
});

router.post('/', validateProject, (req, res) => {
  const project = req.body;
  Projects.insert(project)
    .then(addedProject => {
      res.status(201).json(addedProject)
    })
    .catch( error => {
      console.log(error)
      res.status(500).json({
          message: 'There was an error while adding the project to the database',
          error: error
      });
    });
});

router.delete('/:id', validateProjectId, (req, res) => {
  const id = req.params.id;
  Projects.remove(id)
    .then( success => {
      res.status(200).json({ 
        message: 'project deleted', 
        success: success
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'There was an error removing the  project'
      });
    });
});

router.put('/:id', validateProjectId, validateProject, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  Projects.update(id, changes)
    .then( update => {
      res.status(200).json({ message: 'update success!', project: update })
    })
    .catch( err => {
      res.status(500).json({ 
        message: 'there was an error updating the information in the database.', 
        error: err
      });
    });
});

router.get('/:id/actions', validateProjectId, (req, res) => {
  const id = req.params.id
  Projects.getProjectActions(id)
    .then( response => {
      res.status(200).json({ message: 'success!', actions: response})
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({
          message: 'The project action data could not be retrieved.'
      });
    });
});

function validateProjectId(req, res, next) {
  const id = Number(req.params.id)
  if(id && typeof id === 'number'){
    Projects.get(id)
    .then(project => {
      if (project){
          next();
      } else {
          res.status(400).json({ message: 'invalid project id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The project information could not be retrieved.'
      });
    })
  } else {
    res.status(406).json({ message: 'id not valid'})
  }
}

function validateProject(req, res, next) {
  const newProject = req.body
  if (Object.keys(newProject).length > 0){
    if(newProject.name && newProject.description){
      next();
    }
    else{
      res.status(400).json({
        message: 'Missing required fields, please fill out both name and description'
      })
    }
  } else {
    res.status(400).json({
      message: 'Missing post data'
    })
  }
}

module.exports = router;