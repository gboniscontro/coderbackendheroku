
const isAdmin = (req, res , next) => {
    const path = req.originalUrl;
    const metodo = req.method;
    if (ADMINISTRADOR !== true) {
        return res.status(401).json({
            error: -1,
            descripcion: `ruta ${path} método ${metodo} no autorizada`
        });
    }

    next();
}

const passAuth = (req, res, next) => {
    if (req.user?.username) {
        next()
    } else {
        res.redirect('/login')
    }
}

const  webAuth = (req, res, next)=> {
    if (req.session?.nombre) {
        next()
    } else {
        res.redirect('/login')
    }
}

const apiAuth = (req, res, next) => {
    if (req.session?.nombre) {
        next()
    } else {
        res.status(401).json({ error: 'no autorizado!' })
    }
}

module.exports = {
    isAdmin, webAuth, apiAuth, passAuth
}