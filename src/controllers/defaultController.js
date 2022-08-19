const logger = require('../logger')
function defControl(req, res) {
    const title = 'ROUTING ERROR';
    const { url, method } = req
    logger.warn(`Route ${method} ${url} non-existent`)
    res.status(404).json({ titulo: title });
} 
module.exports = defControl
