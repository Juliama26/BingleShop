"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: "userID",
        as: "user",
        allowNull: false,
      });
      Order.belongsTo(models.Item, {
        foreignKey: "itemID",
        as: "items",
        allowNull: false,
      });
      Order.hasMany(models.OrderDetail, {
        foreignKey: "orderID",
        as: "orderDetails",
        allowNull: false,
      });
    }
  }
  Order.init(
    {
      userID: DataTypes.INTEGER,
      itemID: DataTypes.INTEGER,
      tgl_order: DataTypes.DATE,
      status: DataTypes.ENUM("padding", "finished"),
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
