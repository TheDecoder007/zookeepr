const path = require('path');
const router = require('express').Router();

//GET route that front-end can request data from. 
//(get() requires two arguments) first a string that describes the route
//the client will fetch from. 2nd is callback function that will execute
//when route is accesed with a GET request.

//GET index.html to be served from our express.js server
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  
  //GET animals.html to be served from our express.js server
  router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });
  
  //Get zookeepers.html to be served up from our express.js server
  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });
  
  //wildcard route for client request that doesnt exist. Should always come last
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  module.exports = router;