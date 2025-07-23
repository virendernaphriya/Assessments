const express = require("express");
const connectDb = require("./config/db");
const bcrypt = require("bcrypt");
const Customer = require("./models/customer");
const Invoice = require("./models/invoice");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//to create customer
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const customer = await Customer.findOne({ email });

  if (customer) {
    return res.send("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newCustomer = new Customer({
    name,
    email,
    password: hashedPassword,
  });

  await newCustomer.save();

  res.send("User registered successfully");
});

//to Create an Invoice
app.post("/invoice", async (req, res) => {
  try {
    const { customerId, discount, tax, items } = req.body;

    const newInvoice = new Invoice({
      customer: customerId,
      items,
      discount,
      tax,
    });

    await newInvoice.save();
    res.json("invoice Created Successfully");
  } catch (err) {
    res
      .status(500)
      .json({ mesage: "internal Server error", error: err.message });
  }
});

//to get all invoices
app.get("/invoice", async (req, res) => {
  try {
    const allInvoices = await Invoice.find();
    res.json(allInvoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//to calculate total Due per customer

app.get("/total-due", async (req, res) => {
  const result = await Invoice.aggregate([
    {
      $addFields: {
        subTotal: {
          $sum: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                $multiply: [
                  { $toDouble: "$$item.price" },
                  { $toDouble: "$$item.quantity" },
                ],
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        taxedAmount: {
          $divide: [
            { $multiply: [{ $toDouble: "$subTotal" }, { $toDouble: "$tax" }] },
            100,
          ],
        },
        discountPrice: {
          $divide: [
            {
              $multiply: [
                { $toDouble: "$subTotal" },
                { $toDouble: "$discount" },
              ],
            },
            100,
          ],
        },
      },
    },
    {
      $addFields: {
        totalDue: {
          $add: [
            { $subtract: ["$subTotal", "$discountPrice"] },
            "$taxedAmount",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$customer",
        totalDuePerCustomer: { $sum: "$totalDue" },
      },
    },
  ]);

  res.json(result);
});

app.listen(8080, () => {
  connectDb();
  console.log("server is listening on port 8080");
});
