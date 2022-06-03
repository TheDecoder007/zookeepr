//middleware
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
//router uses the module exported from animalRoutes.js
router.use(animalRoutes);
//router uses new zookeeper routes from zookeeperRoutes.js
router.use(require('./zookeeperRoutes'));


module.exports = router;