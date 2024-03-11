const express = require("express");
const bcrypt = require("bcrypt");
const {User, Item, Order, OrderDetail} = require("./models");

const moment = require("moment");
moment().format();

const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app
  .route("/user")
  .get(async (req, res) => {
    try {
      if (req.query.id) {
        const userID = await User.findOne({
          attributes: ["id", "username", "password", "email", "wave"],
          where: {id: req.query.id},
        });
        if (!userID) {
          return res.status(404).json({message: "User Not Found!"});
        }
        return res.status(200).json(userID);
      } else {
        const userAll = await User.findAll({
          attributes: [
            "id",
            "username",
            "email",
            "wave",
            "createdAt",
            "updatedAt",
          ],
        });
        return res.status(200).json(userAll);
      }
    } catch (error) {
      console.error("Error saat mengambil data: ", error);
      return res.status(500).json({message: "Internal server error"});
    }
  })
  .patch(async (req, res) => {
    const {username, email, password, wave} = req.body;
    try {
      const user = await User.findOne({where: {id: req.query.id}});
      if (!user) return res.status(404).json({message: "User Not Found!"});
      user.username = username;
      user.email = email;
      user.password = password;
      user.wave = wave;
      user.save();
      res.status(200).json({message: "User updated!"});
    } catch (error) {
      console.error("Error saat update: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  })
  .delete(async (req, res) => {
    const user = await User.findOne({where: {id: req.query.id}});
    if (!user) return res.status(404).json({message: "User Not Found!"});
    try {
      await User.destroy({where: {id: req.query.id}});
      res.status(200).json({message: "User deleted!"});
    } catch (error) {
      console.error("Error saat deleted: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  });
// API REGISTER
app.post("/register", async (req, res) => {
  const {username, email, password, wave} = req.body;
  try {
    const isEmail = await User.findOne({where: {email}});
    if (isEmail) return res.status(409).json({message: "Email Conflict!"});
    const user = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      wave,
    });
    await user.save();
    res.status(201).json({message: "User created!"});
  } catch (error) {
    console.error("Error saat register: ", error);
    res.status(500).json({message: "Internal server error"});
  }
});
// API LOGIN
app.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({where: {email}});
    if (!user) return res.status(404).json({message: "Email Not Found!"});
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid)
      return res.status(400).json({message: "Password Invalid"});
    res.status(200).json({message: "Login successful!"});
  } catch (error) {
    console.error("Error saat login: ", error);
    res.status(500).json({message: "Internal server error"});
  }
});

app
  .route("/items")
  .get(async (req, res) => {
    try {
      if (req.query.id) {
        const itemID = await Item.findOne({
          attributes: ["id", "itemName", "deskripsi", "price"],
          where: {id: req.query.id},
        });
        if (!itemID) {
          return res.status(404).json({message: "Item Not Found"});
        }
        return res.status(200).json(itemID);
      } else {
        const itemAll = await Item.findAll();
        return res.status(200).json(itemAll);
      }
    } catch (error) {
      console.error("Error saat mengambil data item: ", error);
      return res.status(500).json({message: "Internal server error"});
    }
  })
  .post(async (req, res) => {
    const {itemName, deskripsi, price} = req.body;
    try {
      const item = new Item({
        itemName,
        deskripsi,
        price,
      });
      await item.save();
      res.status(201).json({message: "Item created!"});
    } catch (error) {
      console.error("Error saat item created: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  })
  .patch(async (req, res) => {
    const {itemName, deskripsi, price} = req.body;
    const item = await Item.findOne({where: {id: req.query.id}});
    if (!item) return res.status(404).json({message: "Item Not Found!"});
    try {
      item.itemName = itemName;
      item.deskripsi = deskripsi;
      item.price = price;
      item.save();
      res.status(200).json({message: "Item updated!"});
    } catch (error) {
      console.error("Error saat item updated!: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  })
  .delete(async (req, res) => {
    const item = await Item.findOne({where: {id: req.query.id}});
    if (!item) return res.json(404).json({message: "Item Not Found!"});
    try {
      await Item.destroy({where: {id: req.query.id}});
      res.status(200).json({message: "Item deleted!"});
    } catch (error) {
      console.error("Error saat deleted!: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  });

app
  .route("/orders")
  .get(async (req, res) => {
    try {
      if (req.query.id) {
        const orderID = await Order.findOne({
          attributes: ["id", "userID", "itemID", "tgl_order", "status"],
          where: {id: req.query.id},
        });
        if (!orderID) {
          return res.status(404).json({message: "Order Not Found!"});
        }
        return res.status(200).json(orderID);
      } else {
        const orderAll = await Order.findAll({
          attributes: [
            "id",
            "userID",
            "itemID",
            "tgl_order",
            "status",
            "createdAt",
            "updatedAt",
          ],
        });
        return res.status(200).json(orderAll);
      }
    } catch (error) {
      console.error("Error saat mengambil data!: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  })
  .post(async (req, res) => {
    const {userID, itemID, tgl_order, status, qty} = req.body;

    const validUser = await User.findOne({where: {id: userID}});
    const validItem = await Item.findOne({where: {id: itemID}});
    if (!validUser || !validItem) {
      return res.status(400).json({message: "Data user atau item Not Found!"});
    }
    const validTglOrder = moment(tgl_order, "YYYY-MM-DD").isValid();
    const validStatus = ["padding", "finished"].includes(status);
    const validQty = Number.isInteger(qty) && qty > 0;
    if (!validTglOrder || !validStatus || !validQty) {
      return res.status(400).json({message: "Format data tidak valid!"});
    }
    try {
      const order = new Order({
        userID,
        itemID,
        tgl_order,
        status,
        qty,
      });
      await order.save();
      res.status(201).json({message: "Order created!"});
    } catch (error) {
      console.error("Error saat membuat order: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  })
  .patch(async (req, res) => {
    const {userID, itemID, tgl_order, status, qty} = req.body;
    const order = await Order.findOne({where: {id: req.query.id}});
    if (!order) return res.status(404).json({message: "Order Not Found!"});
    try {
      order.userID = userID;
      order.itemID = itemID;
      order.tgl_order = tgl_order;
      order.status = status;
      order.qty = qty;
      order.save();
      res.status(200).json({message: "Order updated!"});
    } catch (error) {
      console.error("Error saat order updated: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  })
  .delete(async (req, res) => {
    const order = await Order.findOne({where: {id: req.query.id}});
    if (!order) return res.status(404).json({message: "Order Not Found!"});
    try {
      await Order.destroy({where: {id: req.query.id}});
      res.status(200).json({message: "Order deleted!"});
    } catch (error) {
      console.error("Error saat deleted!: ", error);
      res.status(500).json({message: "Internal server error"});
    }
  });

// tidak sempat ngerjain
app
  .route("/details")
  .get(async (req, res) => {})
  .post(async (req, res) => {})
  .patch(async (req, res) => {})
  .delete(async (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
