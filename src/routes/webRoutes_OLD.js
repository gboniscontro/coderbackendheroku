const { Router } = require("express")
const { webAuth } = require('../middlewares/admin')

const webRouter = Router()

/*
webRouter.get('/', (req, res) => {
    res.redirect('/home')
})
webRouter.get('/signup', (req, res) => {
    res.redirect('/signup.html')
})

webRouter.get('/login', (req, res) => {
    const nombre = req.session?.nombre
    if (nombre) {
        res.redirect('/')
    } else {
        res.redirect('/login.html')
    }
})

webRouter.get('/logout', (req, res) => {
    const nombre = req.session?.nombre
    if (nombre) {
        req.session.destroy(err => {
            if (!err) {

                res.render(path.join(process.cwd(), 'src/views/logout.hbs'), { nombre: nombre })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.redirect('/')
    }
})


webRouter.post('/login', (req, res) => {
    req.session.nombre = req.body.nombre
    res.redirect('/home')
})
webRouter.get('/dashboard', webAuth, (req, res) => {
    res.redirect('/home')
})

webRouter.get('/home', webAuth, (req, res) => {
    //si o si tengo que usar handelblars para enviar la variable nombre a la vista no se puede hacer con un html como antes
    // res.sendFile(path.join(process.cwd(), '/index.html'))

    res.render(path.join(process.cwd(), 'src/views/index.hbs'), { nombre: req.session.nombre })
})
*/

module.exports = webRouter
