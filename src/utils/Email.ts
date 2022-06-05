import { Transport, Transporter } from "nodemailer";
import { Util } from "./Util";

const nodemailer = require("nodemailer");

const email_subject = "Sending Email using Node.js";
const email_text = "That was easy!";
let email_to = ["adityagudimetla@gmail.com"];

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

    sendEmail(email_from: string, email_to: string, email_subject: string, email_text: string | null = null, email_html: string | null = null) {
        let mailOptions: any;
        if (email_html) {
            mailOptions = {
                from: email_from,
                to: email_to,
                subject: email_subject,
                html: email_html
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
        const regexString = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        var re = new RegExp(regexString);
        return re.test(s);
    }

    sendEmails(email_from: string, email_to: string[], email_subject: string, email_text: string | null = null, email_html: string | null = null) {
        email_to.forEach(to => {
            if(this.validEmail(to)) {
                this.sendEmail(email_from , to , email_subject , email_text , email_html);
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
                console.log(`\n\tNo. of values are less than number of variables. \n\tPlease check the input value : [${value}] doesn't fit variables [${varNames}]\n\t`);
            }
        });
        return output;
    }
}

export { Emails };