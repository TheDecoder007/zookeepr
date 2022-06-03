//use router instead of app to declare routes in any file, 
//as long as you use the proper middleware
const router = require('express').Router();
//imports for functions used on this page
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
 });
 
 //GET route using req.params using id to get just one animal
 //param route must come after other GET route
 
 router.get('/animals/:id', (req, res) => {
   const result = findById(req.params.id, animals);
     if (result) {
     res.json(result);
     } else {
       res.send(404);
     }
 });
 
 //POST route for client to send data to the api (app.post)
 
 router.post('/animals', (req, res) => {
 
   //set id based on what the next index of the array will be
   req.body.id = animals.length.toString();
 
   // if any data in req.body is incorrect, send 400 error back
     if (!validateAnimal(req.body)) {
       res.status(400).send('The animal is not properly formatted.');
     } else {
 
   //add animal to json file and animals array in this function
   const animal = createNewAnimal(req.body, animals);
 
    // req.body is where our incoming content will be
    res.json(animal);
     }
 });
 
 module.exports = router;