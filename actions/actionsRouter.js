const express = require('express');
const router = express.Router();
const Actions = require('../data/helpers/actionModel');
const Projects = require('../data/helpers/projectModel');

router.use(express.json());

router.get('/', (req, res) => {
  Actions.get()
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

router.get('/:id', validateActionId, (req, res) => {
  const id = req.params.id
  Actions.get(id)
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

router.post('/:id', validateAction, validateProjectExists, (req, res) => {
  const newAction = req.action
  Actions.insert(newAction)
    .then( success => {
      res.status(201).json(success)
    })
    .catch( error => {
      console.log(error)
      res.status(500).json({
          message: 'There was an error while adding the action to the database',
          error: error
      });
    });
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
  const id = req.params.id;
  const update = req.body;
  Actions.update(id, update)
    .then( success => {
      res.status(201).json(success)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
          message: 'There was an error while updating the action to the database',
          error: error
      });
    });
});

router.delete('/:id', validateActionId, (req, res) => {
  const id = req.params.id;
  Actions.remove(id)
    .then( success => {
      res.status(200).json({ 
        message: 'action deleted', 
        success: success
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'There was an error removing the action'
      });
    });
});


function validateActionId(req, res, next) {
  const id = Number(req.params.id)
  if(id && typeof id === 'number'){
    Actions.get(id)
    .then(action => {
      if (action){
          next();
      } else {
          res.status(400).json({ message: 'invalid action id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
          message: 'The action information could not be retrieved.'
      });
    })
  } else {
    res.status(406).json({ message: 'id not valid'})
  }
}

function validateAction(req, res, next) {
  const newAction = req.body
  if (Object.keys(newAction).length > 0){
    // putting action object on req
    req.action = newAction
    if(newAction.notes && newAction.description && newAction.project_id){
      next();
    }
    else{
      res.status(400).json({
        message: 'Missing required fields, please fill out correct project_id, description and notes'
      })
    }
  } else {
    res.status(400).json({
      message: 'Missing action data'
    })
  }
}

function validateProjectExists(req, res, next) {
  const action = req.action
  const id = Number(req.params.id)
  if(id && typeof id === 'number'){
    Projects.get(id)
    .then(project => {
      if (project.id === action.project_id){
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

module.exports = router;