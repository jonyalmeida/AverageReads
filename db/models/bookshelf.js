'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bookshelf = sequelize.define('Bookshelf', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reading: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    haveRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    wantsToRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {});
  Bookshelf.associate = function (models) {
    // associations can be defined here
    Bookshelf.belongsTo(models.Book, { foreignKey: 'bookId' });
    Bookshelf.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return Bookshelf;
};