"use strict";
exports.__esModule = true;
require("dotenv").config();
var Email_1 = require("./utils/Email");
var Util_1 = require("./utils/Util");
var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var console = require("console");
var fs = require("fs");
var csv_1 = require("csv");
var app = express();
var PORT = process.env.PORT || 9010;
var upload = multer({ dest: 'src/uploads/' });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array("csvFile" , 1)); 
app.use(express.static('public'));
var EMAIL = (typeof process.env.EMAIL === 'undefined') ? ("") : process.env.EMAIL;
var PASSWORD = (typeof process.env.PASSWORD === 'undefined') ? ("") : process.env.PASSWORD;
var email;
if (EMAIL === "" || PASSWORD === "") {
    console.log("\n\nPlease Configure Email and Password, then restart application. \n  \nTo add username/password, create a .env folder at root and add them as shown\n  \n\tEMAIL = 'email'\n  \n\tPASSWORD = 'password'\n  \n\n If you're using an app password, put it in the password field.");
}
else {
    app.locals.email = new Email_1.Emails(EMAIL, PASSWORD);
    app.post("/", upload.single("send_to"), function (req, res) {
        // ----------------------------------------------------------------------------------------------------------------------------
        // Declaring Variables.
        var text;
        var subject;
        var varNames;
        var inputValues = [];
        var output = [];
        var email_to = [];
        var email = app.locals.email;
        var fileData = [];
        // Reading csv file.
        var filePath = __dirname + "/uploads/".concat(req.file.filename);
        fs.createReadStream(filePath)
            .pipe((0, csv_1.parse)({ delimiter: ",", from_line: 1 }))
            .on("data", function (row) {
            // Pushing csv row by row
            fileData.push(row);
        })
            .on("end", function () {
            // Debug stuff
            fs.unlinkSync(filePath);
            Util_1.Util.logStep();
            console.log("finished reading csv");
            console.log(fileData);
            // Data Template -> xs:x -> xs = input values ; x = email. Popping email leaves only input values.
            // Assingn accordingly
            fileData.forEach(function (row) {
                // trim each element of row due to spaces + other nonsense.
                row = row.map(function (e) { return e.trim(); });
                email_to.push(row.pop());
                inputValues.push(row);
            });
            // Check inside. fn validInput parses through input from POST request and transforms it into object.
            // Used to also parse inputValues before shifting into CSV. 
            var input = email.validInput(req.body.text, req.body.varNames, req.body.subject);
            text = input[0];
            subject = input[2];
            varNames = input[1];
            // Creates final output email. No idea how it looks in mail.
            output = email.composeEmail(text, varNames, inputValues);
            console.log(output);
            console.log(email_to);
            email.sendEmails(EMAIL, email_to, subject, output);
            // Just for debugging purposes. Should probably send a 200 code.
            var final_output = email_to.map(function (e, i) { return [e, output[i]]; });
            res.send(final_output);
        })
            .on("error", function (error) {
            console.log(error.message);
        });
    });
    app.listen(PORT, function () { console.log("Listening on port ".concat(PORT, " \n Check http://localhost:9010/")); });
}
