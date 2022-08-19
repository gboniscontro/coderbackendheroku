const { Router } = require('express');
const defControl = require('../controllers/defaultController');
const defRoute = new Router();
defRoute.get('/*', defControl);
defRoute.post('/*', defControl);
defRoute.delete('/*', defControl);
defRoute.put('/*', defControl);
module.exports = defRoute;
