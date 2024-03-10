'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Order, {
        foreignKey: "orderID",
        as: "orders",
        allowNull: false,
      });
      OrderDetail.belongsTo(models.Item, {
        foreignKey: "itemID",
        as: "items",
        allowNull: false,
      });
    }
  }
  OrderDetail.init({
    orderID: DataTypes.INTEGER,
    itemID: DataTypes.INTEGER,
    total_price: DataTypes.DECIMAL(10, 2),
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};