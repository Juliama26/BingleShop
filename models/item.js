"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.hasMany(models.Order, {
        foreignKey: "itemID",
        as: "orders",
        allowNull: false,
      });
      Item.hasMany(models.OrderDetail, {
        foreignKey: "itemID",
        as: "orderDetails",
        allowNull: false,
      });
    }
  }
  Item.init(
    {
      itemName: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      deskripsi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
