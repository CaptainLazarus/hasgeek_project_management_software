import { Transport, Transporter } from "nodemailer";
import { Util } from "./Util";

const nodemailer = require("nodemailer");

// const email_subject = "Sending Email using Node.js";
// const email_text = "That was easy!";
// let email_to = ["adityagudimetla@gmail.com"];

class Emails {
    transporter: Transporter;

    constructor(email: string, password: string) {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: password,
            },
        });
        console.log("Transporter Created");
    }

    sendEmail(email_from: string, email_to: string, email_subject: string, email_text: string | null = null, isHTML: Boolean) {
        let mailOptions: any;
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

        this.transporter.sendMail(
            mailOptions,
            function (error: any, info: { response: string }) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            }
        );
    }

    validEmail(s: string) {
        const regexstring = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        var re = new RegExp(regexstring);
        return re.test(s);
    }

    getText(s: string, defaultText: string = "Undefined string") {
        if (s == undefined) {
            return defaultText;
        }
        else {
            return s;
        }
    }

    getVars(vars: string, defaultVars: string[] = []) {
        try {
            let temp = vars.split(',');
            let output = []
            for (let i = 0; i < temp.length; i++) {
                output.push(temp[i].trim());
            }
            return output;
        } catch (error) {
            return defaultVars
        }
    }

    parseValues(s: string) {
        const regexString = /\[\s*\"[^\"]*\"\s*(?:,\s*\"[^\"]*\")*\]/g;
        var re = new RegExp(regexString);
        const vals: string[] | null = s.match(re);
        if(vals === null){
            return [];
        }
        return vals;
    }

    getValues(values: string, defaultValues: string[][]) {
        try {
            let temp: string[] | null = this.parseValues(values);
            let output = []
            for (let i = 0; i < temp.length; i++) {
                output.push(JSON.parse(temp[i]));
            }
            return output;
        } catch (e) {
            return defaultValues;
        }
    }

    validInput(text: string, vars: string, subject: string , values: string) {
        let IO: any[] = ["", [], []];

        // Some reason I'm doing this. I've forgotten now.

        IO[0] = this.getText(text, "Automated Message, Beep boop I am ${Name} and hope you are ${Status}!");
        IO[2] = this.getText(subject , "Automated Mail");
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
    }

    sendEmails(email_from: string, email_to: string[], email_subject: string, email_text: string[], isHTML: Boolean) {
        email_to.forEach((to,i) => {
            if (this.validEmail(to)) {
                this.sendEmail(email_from, to, email_subject, email_text[i] , isHTML);
            }
            else {
                console.log(`Invalid Email : ${to}`);
            }
        });
    }

    composeEmail(text: string, varNames: string[], inputValues: string[][]) {
        let output: string[] = [];
        inputValues.forEach(value => {
            if (Util.glequal(value, varNames)) {

                let temp: string = text;
                for (let i = 0; i < varNames.length; i++) {
                    temp = temp.replace(`\$\{${varNames[i]}\}`, value[i]);
                }
                output.push(temp);
            }
            else {
                console.log(`\n\tNo. of values are less than number of variables. 
                \n\tPlease check the input value : [${value}] doesn't fit variables [${varNames}]\n\t`);
            }
        });
        return output;
    }
}

export { Emails };