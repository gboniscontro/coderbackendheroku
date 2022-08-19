const logger=require("./logger")


class ObjError {
    constructor(estado, mensaje, detalles) {
        this.estado = estado
        this.mensaje = mensaje
        this.detalles = detalles
        logger.error(mensaje + ' ' + detalles)
    }
}

module.exports = ObjError