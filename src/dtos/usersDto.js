const bCrypt = require('bcrypt');
class UserDto {
  email;
  password;
  roles;
  username;
  nombre;
  apellido;
  direccion;
  fechaNacimiento;
  telefono;
  avatar;
  constructor({ _id, email, password, roles, username, nombre, apellido, direccion, fechaNacimiento, telefono, avatar }) {
    if (_id === undefined) {
      this._id = undefined;
      this.roles = ['usuario'];
      this.password = createHash(password);
    } else {
      this._id = _id;
      this.roles = roles;
      this.password = password;
    }

    this.email = email;
    this.username = username;
    this.nombre = nombre;
    this.apellido = apellido;
    this.direccion = direccion;
    this.fechaNacimiento = fechaNacimiento;
    this.telefono = telefono;
    this.avatar = avatar;
  }

  get() {
    return this;
  }

  isValidPassword(password) {
    return bCrypt.compareSync(password, this.password);
  }
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = UserDto;
