const express = require("express");
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
//to use publlc files write here requerd lines and for now nit used 
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname,"public")));
const port= process.env.PORT ||8080


import dotenv from 'dotenv';
dotenv.config(); // load variables from .env

import mysql from 'mysql2';

// create connection reading from env
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'apnacollege62',
  database: process.env.DB_NAME || 'delta_app'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // optional: crash so Render shows failure
  }
  console.log('Connected to DB');
});



let getUser = () => {
  return [
    faker.datatype.uuid(),
    faker.internet.userName(),//not used for now here in notes another way read ..
    faker.internet.email(),
    faker.internet.password(),
  ];
};


app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result;
      res.render("users.ejs", { data });
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE userId='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username, password } = req.body;
  console.log(username);
  let q = `SELECT * FROM user WHERE userId='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password.trim() != password.trim()) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `UPDATE user SET username='${username}' WHERE userId='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("updated!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (userId, username, email, password) VALUES ('${id}','${username}','${email}','${password}') ;`

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");//note insrert only unique email ids as we kept constraint otherwise is sever stops running /carshes
      res.redirect("/user");// to slove crashing of server can write a code for this to show you enter email alredy exits by checking
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE userId='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE userId='${id}'`;
console.log(password);
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user.password);
       console.log(user.password != password);

      if (user.password.trim() != password.trim()) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE userId='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.listen("8080", () => {
  console.log( `server running on ${port} `);
});