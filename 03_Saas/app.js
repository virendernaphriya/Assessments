const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const Company = require("./models/company");
const Employee = require("./models/employee");
const checkforAuth = require("./middlewares/auth");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("testing only");
});

app.post("/signup/:role", async (req, res) => {
  const role = req.params.role;
  if (role == "employee") {
    const { name, email, password, tenantId } = req.body;

    const employee = await Employee.find({ email, tenantId });
    console.log(employee);

    if (employee.length > 0) {
      return res.send("Employee already exists with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      tenantId,
    });

    await newEmployee.save();

    res.send("Employee Registered successfuly");
  } else if (role == "company") {
    const { companyName, email, password, tenantId } = req.body;

    const company = await Company.find({ tenantId });
    if (company.length > 0) {
      return res.send("Company already exists with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new Company({
      companyName,
      email,
      password: hashedPassword,
      tenantId,
    });

    await newCompany.save();

    res.send("Company Registered successfuly");
  } else {
    res.send("invalid request");
  }
});

app.post("/login/:role", async (req, res) => {
  const role = req.params.role;
  if (role == "employee") {
    const { email, password, tenantId } = req.body;

    const employee = await Employee.find({ tenantId, email });

    if (!employee) {
      return res.send("Invalid Credentials");
    }

    const isValidPassword = await bcrypt.compare(password, employee.password);

    if (!isValidPassword) {
      return res.send("Invalid Credentials");
    }

    const payload = {
      email: employee[0].email,
      tenantId: employee[0].tenantId,
    };

    const token = jwt.sign(payload, process.env.jwtSecret);
    res.cookie("token", token);
    res.send("employee login successful", token);
  } else if (role == "company") {
    const { email, password, tenantId } = req.body;

    const company = await Company.find({ tenantId, email });

    console.log(company);
    if (!company) {
      return res.send("Invalid Credentials");
    }

    const isValidPassword = await bcrypt.compare(password, company[0].password);

    if (!isValidPassword) {
      return res.send("Invalid Credentials");
    }

    const payload = {
      email: company[0].email,
      tenantId: company[0].tenantId,
    };

    const token = jwt.sign(payload, process.env.jwtSecret);
    res.cookie("token", token);
    res.send("company login successful", token);
  } else {
    return res.send("invalid request");
  }
});

//get all employees of a company
app.get("/employee", checkforAuth, async (req, res) => {
  console.log("this si testing", req.user);
  const tenantId = req.user.tenantId;
  const employees = await Employee.find({ tenantId });
  res.send(employees);
});

app.listen(8080, () => {
  connectDb();
  console.log("server is listening on port 8080");
});
