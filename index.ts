import { request } from "https";

require("dotenv").config();

const nodemailer = require("nodemailer");
const express = require("express");
const parser = require("body-parser");
const app = express();

// One transporter is required.
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Put this in Loop and modify accordingly.
var mailOptions = {
  from: process.env.EMAIL,
  to: "adityagudimetla@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

transporter.sendMail(
  mailOptions,
  function (error: any, info: { response: string }) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  }
);

app.get("/" , (req: any , res: any) => {
  return res.send("<p>Hello</p>")
});

app.listen(3000);