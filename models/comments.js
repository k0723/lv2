'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, { // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'userId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userid', // 4. Comments 모델의 UserId 컬럼과 연결합니다.
      });

      // 1. Comments 모델에서
      this.belongsTo(models.posts, { // 2. Posts 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'postId', // 3. Posts 모델의 postId 컬럼을
        foreignKey: 'postid', // 4. Comments 모델의 PostId 컬럼과 연결합니다.
      });
      // define association here
    }
  }
  comments.init({

    userid : {type: DataTypes.INTEGER},

    postid : {type: DataTypes.INTEGER},
    
    comment: {type: DataTypes.STRING},

    commentId: {
      allowNull: false, // NOT NULL
      autoIncrement: true, // AUTO_INCREMENT
      primaryKey: true, // Primary Key (기본키)
      type: DataTypes.INTEGER,
    },
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
    modelName: 'comments',
  });
  return comments;
};