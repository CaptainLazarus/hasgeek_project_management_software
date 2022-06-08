require("dotenv").config();
import { Emails } from "./utils/Email";
import { Util } from "./utils/Util";

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const console = require("console");
import * as fs from "fs";

import { Multer } from 'multer';
import { parse } from "csv";
import { Express } from "express";

const app: Express = express();
const PORT: Number | String = process.env.PORT || 9010;
const upload: Multer = multer({ dest: 'src/uploads/' })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array("csvFile" , 1)); 
app.use(express.static('public'));

const EMAIL: string = (typeof process.env.EMAIL === 'undefined') ? ("") : process.env.EMAIL;
const PASSWORD: string = (typeof process.env.PASSWORD === 'undefined') ? ("") : process.env.PASSWORD;
let email: Emails | null;

if (EMAIL === "" || PASSWORD === "") {
      console.log(`\n\nPlease Configure Email and Password, then restart application. 
  \nTo add username/password, create a .env folder at root and add them as shown
  \n\tEMAIL = 'email'
  \n\tPASSWORD = 'password'
  \n\n If you're using an app password, put it in the password field.`);
}
else {
      app.locals.email = new Emails(EMAIL, PASSWORD);
      app.post("/", upload.single("send_to"), (req: any, res: any) => {
            // ----------------------------------------------------------------------------------------------------------------------------
            // Declaring Variables.

            let text: string;
            let subject: string;
            let varNames: string[]
            let inputValues: string[][] = [];
            let output: string[] = [];
            let email_to: any[] = [];
            let email = app.locals.email;
            let fileData: string[][] = [];

            // Reading csv file.
            const filePath = __dirname+`/uploads/${req.file.filename}`
            fs.createReadStream(filePath)
                  .pipe(parse({ delimiter: ",", from_line: 1 }))
                  .on("data", function (row: any) {
                        // Pushing csv row by row
                        fileData.push(row); 
                  })
                  .on("end", function () {
                        // Debug stuff
                       fs.unlinkSync(filePath);
                       Util.logStep();
                       console.log("finished reading csv");
                       console.log(fileData);

                       // Data Template -> xs:x -> xs = input values ; x = email. Popping email leaves only input values.
                       // Assingn accordingly
                       fileData.forEach(row => {
                             // trim each element of row due to spaces + other nonsense.
                             row = row.map((e) => e.trim())
                             email_to.push(row.pop());
                             inputValues.push(row);
                       });

                       // Check inside. fn validInput parses through input from POST request and transforms it into object.
                       // Used to also parse inputValues before shifting into CSV. 
                       const input = email.validInput(req.body.text, req.body.varNames , req.body.subject);

                       text = input[0];
                       subject = input[2];
                       varNames = input[1];
                       
                       // Creates final output email. No idea how it looks in mail.
                       output = email.composeEmail(text, varNames, inputValues);
                       console.log(output);
                       console.log(email_to);

                       email.sendEmails(EMAIL , email_to, subject, output);

                       // Just for debugging purposes. Should probably send a 200 code.
                       var final_output = email_to.map((e,i) => [e,output[i]]);
                       res.send(final_output);
                        
                  })
                  .on("error", function (error) {
                        console.log(error.message);
                  });
      });
      app.listen(PORT, () => { console.log(`Listening on port ${PORT} \n Check http://localhost:9010/`) });
}