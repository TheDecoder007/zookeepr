const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const PORT = process.env.PORT || 3001;
const app = express();

//two middleware functions must be set up for server that acccepts POST data
//parse incoming string or array data (middleware function)
app.use(express.urlencoded({ extended: true}));

//parse incoming JSON data (middleware function)
app.use(express.json());

//built in Express.js middleware that instructs server to make certain files readily available
//and not require seperate routes for each one (js and css for the html)
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

//route that front-end can request data from. 
//(get() requires two arguments) first a string that describes the route
//the client will fetch from. 2nd is callback function that will execute
//when route is accesed with a GET request.
//using send() method from res(response) parameter, sends
//Hello to http://localhost:3001/api/animals
// app.get('/api/animals', (req, res) => {
    //     res.send('Hello');
    // });   



//sets up server on a port (3001)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});