'use strict';

const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    nome: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3,40]
        }
      }
    },
    email: DataTypes.STRING,
    senha: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3,40]
        }
      }
    },
    cursoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};