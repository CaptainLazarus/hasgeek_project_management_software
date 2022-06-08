"use strict";
exports.__esModule = true;
exports.Emails = void 0;
var Util_1 = require("./Util");
var nodemailer = require("nodemailer");
// const email_subject = "Sending Email using Node.js";
// const email_text = "That was easy!";
// let email_to = ["adityagudimetla@gmail.com"];
var Emails = /** @class */ (function () {
    function Emails(email, password) {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: password
            }
        });
        console.log("Transporter Created");
    }
    Emails.prototype.sendEmail = function (email_from, email_to, email_subject, email_text, isHTML) {
        if (email_text === void 0) { email_text = null; }
        var mailOptions;
        if (isHTML) {
            mailOptions = {
                from: email_from,
                to: email_to,
                subject: email_subject,
                html: email_text
            };
        }
        else {
            mailOptions = {
                from: email_from,
                to: email_to,
                subject: email_subject,
                text: email_text
            };
        }
        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
    };
    Emails.prototype.validEmail = function (s) {
        var regexstring = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = new RegExp(regexstring);
        return re.test(s);
    };
    Emails.prototype.getText = function (s, defaultText) {
        if (defaultText === void 0) { defaultText = "Undefined string"; }
        if (s == undefined) {
            return defaultText;
        }
        else {
            return s;
        }
    };
    Emails.prototype.getVars = function (vars, defaultVars) {
        if (defaultVars === void 0) { defaultVars = []; }
        try {
            var temp = vars.split(',');
            var output = [];
            for (var i = 0; i < temp.length; i++) {
                output.push(temp[i].trim());
            }
            return output;
        }
        catch (error) {
            return defaultVars;
        }
    };
    Emails.prototype.parseValues = function (s) {
        var regexString = /\[\s*\"[^\"]*\"\s*(?:,\s*\"[^\"]*\")*\]/g;
        var re = new RegExp(regexString);
        var vals = s.match(re);
        if (vals === null) {
            return [];
        }
        return vals;
    };
    Emails.prototype.getValues = function (values, defaultValues) {
        try {
            var temp = this.parseValues(values);
            var output = [];
            for (var i = 0; i < temp.length; i++) {
                output.push(JSON.parse(temp[i]));
            }
            return output;
        }
        catch (e) {
            return defaultValues;
        }
    };
    Emails.prototype.validInput = function (text, vars, subject, values) {
        var IO = ["", [], []];
        // Some reason I'm doing this. I've forgotten now.
        IO[0] = this.getText(text, "Automated Message, Beep boop I am ${Name} and hope you are ${Status}!");
        IO[2] = this.getText(subject, "Automated Mail");
        IO[1] = this.getVars(vars, ["Name", "Status"]);
        // Save this code 
        // If the input Values are sent in as a string.
        // if(arguments.length == 4){
        //     IO[3] = this.getValues(values, [
        //         ["Bot1", "fine"],
        //         ["Bot2", "well"]]
        //     );
        // }
        // else {
        //     IO[3] = []
        // }
        return IO;
    };
    Emails.prototype.sendEmails = function (email_from, email_to, email_subject, email_text, isHTML) {
        var _this = this;
        email_to.forEach(function (to, i) {
            if (_this.validEmail(to)) {
                _this.sendEmail(email_from, to, email_subject, email_text[i], isHTML);
            }
            else {
                console.log("Invalid Email : ".concat(to));
            }
        });
    };
    Emails.prototype.composeEmail = function (text, varNames, inputValues) {
        var output = [];
        inputValues.forEach(function (value) {
            if (Util_1.Util.glequal(value, varNames)) {
                var temp = text;
                for (var i = 0; i < varNames.length; i++) {
                    temp = temp.replace("${".concat(varNames[i], "}"), value[i]);
                }
                output.push(temp);
            }
            else {
                console.log("\n\tNo. of values are less than number of variables. \n                \n\tPlease check the input value : [".concat(value, "] doesn't fit variables [").concat(varNames, "]\n\t"));
            }
        });
        return output;
    };
    return Emails;
}());
exports.Emails = Emails;
