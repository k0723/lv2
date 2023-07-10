'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.users, { // 2. UserInfos 모델에게 1:1 관계 설정을 합니다.
        sourceKey: 'userId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userId', // 4. UserInfos 모델의 UserId 컬럼과 연결합니다.
      });
      this.belongsTo(models.posts, { // 2. Users 모델에게 1:1 관계 설정을 합니다.
        targetKey: 'postId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userId', // 4. UserInfos 모델의 UserId 컬럼과 연결합니다.
      });
      // define association here
    }
  }
  users.init({
    userId: {
      allowNull: false, // NOT NULL
      autoIncrement: true, // AUTO_INCREMENT
      primaryKey: true, // Primary Key (기본키)
      type: DataTypes.INTEGER,},

    nickname: {DallowNull: false, // NOT NULL
        type: DataTypes.STRING,
        unique: true},
    password: DataTypes.STRING,
    createdAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false, // NOT NULL
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};