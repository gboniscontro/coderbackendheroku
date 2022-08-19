const UserDao = require('../daos/usersDao');
const UserDto = require('../dtos/usersDto');
const ObjError = require('../objError');
const logger = require('../logger');
const { enviarEmail } = require('./notificaciones/email');

class UsersService {
  constructor() {
    this.userDao = new UserDao();
  }

  //login de usuario
  async login(email, password) {
    logger.info(`usersService.js - login`);
    try {
      const data = await this.userDao.getUserbyEmail(email);
      if (data == undefined || data == null) return false;
      const usuario = new UserDto(data);
      if (!usuario.isValidPassword(password)) return false;

      return usuario.get();
    } catch (err) {
      //logger.error(`Error al loguearse: ${JSON.stringify(err)}`);
      throw new ObjError(401, `Error al loguearse`, err);
      return false;
    }
  }

  async getUsuario(email) {
    logger.info(`usersService.js - getUsuario(${email})`);
    const usuariosObj = await this.userDao.getUserbyEmail(email);
    return usuariosObj;
  }
  async getUsuariobyId(Id) {
    logger.info(`usersService.js - getUsuario(${Id})`);
    const usuariosObj = await this.userDao.getById(Id);
    return usuariosObj;
  }
  //alta de usuario nuevo
  async crearUsuario(objetoUsuario) {
    logger.info(`usersService.js - crearUsuario`);
    if (!objetoUsuario.email) throw new ObjError(404, `El campo 'email' es obligatorio `);
    if (!objetoUsuario.password) throw new ObjError(404, `El campo 'password' es obligatorio `);

    try {
      const usuario = new UserDto(objetoUsuario);
      usuario._id = await this.userDao.add(usuario);
      logger.info(`Registro de Usuario Ok `);
      await this.enviarEmailNuevoUsuario(usuario);
      return usuario.get();
    } catch (err) {
      logger.error(`Error al crear el usuario: ${err}`);
      throw new ObjError(401, `Error al crear el usuario`, err);
    }
  }
  //enviarEmailNuevoUsuario
  async enviarEmailNuevoUsuario(objetoUsuario) {
    logger.info(`usersService.js - enviarEmailNuevoUsuario`);
    try {
      let correoDestino = process.env.MAIL_USER;
      let asunto = 'Nuevo registro';
      let cuerpo = `<h1> Nuevo Registro </h1>
            <p><strong>Email: </strong>${objetoUsuario.email}</p>
            <p><strong>Username: </strong>${objetoUsuario.username}</p>
            <p><strong>Nombre: </strong>${objetoUsuario.nombre}</p>
            <p><strong>Apellido: </strong>${objetoUsuario.apellido}</p>
            <p><strong>Direccion: </strong>${objetoUsuario.direccion}</p>
            <p><strong>Fecha de Nacimiento: </strong>${objetoUsuario.fechaNacimiento}</p>
            <p><strong>Teléfono: </strong>${objetoUsuario.telefono}</p>
            <p><strong>Avatar: </strong>${objetoUsuario.imagenUrl}</p>
            <p><strong>Roles: </strong>${objetoUsuario.roles}</p>`;
      await enviarEmail(correoDestino, asunto, cuerpo);
    } catch (err) {
      logger.error(`Falló el envio de mail - error:${err}`);
    }
  }
}
module.exports = UsersService;
