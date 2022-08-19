const { Router } = require("express")
const { fork } = require("child_process");




const random = Router()
let counter = 0;
random.get('/count', (req, res) => {
    counter++
    res.send(`Visita numero ${counter}`)
})



// for routes looking like this `/products?page=1&pageSize=50`
/*app.get('/products', function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  res.send(`Filter with parameters ${page} and ${pageSize});`
});
*/
random.get('/', (req, res) => {
    let cantidad = req.query.cant ?? 100000000;

    const sum = fork('./src/hijoRandom.js', [cantidad])

    sum.on('message', msg => {
        res.send(`Resultado: ${msg}`)
    })
})

module.exports = random
