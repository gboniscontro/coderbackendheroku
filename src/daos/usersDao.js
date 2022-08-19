const ContainerMongo = require('../containers/ContainerMongo');
const userModel = require('../models/user');
const ObjError = require('../objError');
const logger = require('../logger');
class UserDao extends ContainerMongo {
  constructor() {
    super(userModel);
  }
  async getUserbyEmail(email) {
    let user = await this.model.findOne({ email: email });
    logger.info('User found', user);
    return user;
  }
}

module.exports = UserDao;
