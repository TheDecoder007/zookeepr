const express = require('express');
const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;
const app = express();
//two middleware functions must be set up for server that acccepts POST data
//parse incoming string or array data (middleware function)
app.use(express.urlencoded({ extended: true}));
//parse incoming JSON data (middleware function)
app.use(express.json());

//route that front-end can request data from. 
//(get() requires two arguments) first a string that describes the route
//the client will fetch from. 2nd is callback function that will execute
//when route is accesed with a GET request.
//using send() method from res(response) parameter, sends
//Hello to http://localhost:3001/api/animals
// app.get('/api/animals', (req, res) => {
    //     res.send('Hello');
    // });   

//filters requests, called back in GET 
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

//function to find an animal by id, used in the other GET route
//takes in the id and array of animals, checks if that id exists,
//and returns a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

//accepts POST routes req.body value and the array we want to add the data to
function createNewAnimal(body, animalsArray) {
  console.log(body);
  //saves to animals array
    const animal = body;
    animalsArray.push(animal);
  //writes new data to animals.json
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
  //saves JavaScript array data as JSON. null means we don't want to edit any existing data,
  // 2 means we want to create white space between our values to make it more readable
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  //return finished code to post route for response
  return animal;
}

//VALIDATE takes new animal data from req.body and checks that each key exists, 
//and it is also the right type of data
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

//GET route that front-end can request data from. 
//(get() requires two arguments) first a string that describes the route
//the client will fetch from. 2nd is callback function that will execute
//when route is accesed with a GET request.

app.get('/api/animals', (req, res) => {
   let results = animals;
   if (req.query) {
       results = filterByQuery(req.query, results);
   }
   res.json(results);
});

//GET route using req.params using id to get just one animal
//param route must come after other GET route

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
    if (result) {
    res.json(result);
    } else {
      res.send(404);
    }
});

//POST route for client to send data to the api (app.post)

app.post('/api/animals', (req, res) => {

  //set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {

  //add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);

   // req.body is where our incoming content will be
   console.log(req.body);
   res.json(animal);
    }
});

//sets up server on a port (3001)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});