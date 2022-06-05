require("dotenv").config();
import { Emails } from "./utils/Email";
import express, { Express } from "express"
import bodyParser from "body-parser";
import multer, { Multer } from 'multer';
import {Util} from "./utils/Util";

const app: Express = express();
const PORT: Number | String = process.env.PORT || 9010;
const upload: Multer = multer({ dest: 'uploads/' })

app.use(bodyParser.urlencoded({ extended: true }));

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
  app
    .post("/" , (req: any , res: any) => {
      email = new Emails(EMAIL, PASSWORD);

// ----------------------------------------------------------------------------------------------------------------------------
      
      let text: string;
      let varNames: string[]
      let inputValues: string[][]
      let output: string[] = [];
      let email_to: string[] = [];

// ----------------------------------------------------------------------------------------------------------------------------

      text = req.body.text || "Hello ${NAME}, how's ${ADDRESS}?"; // Take from user
      varNames = req.body.text || ["NAME", "ADDRESS"]; // Take from user
      inputValues = req.body.inputValues || [["aditya", "hyderabad"], ["priya", "gwalior"] , ["asdmnas", "ior" , "asdjansd"]]; // Take from CSV
    
// ----------------------------------------------------------------------------------------------------------------------------

      output = email.composeEmail(text , varNames , inputValues);

// ----------------------------------------------------------------------------------------------------------------------------
      

      for(let i=0 ; i < email_to.length ; i++){
            console.log(i);
      }
      console.log(output);
    
    })
    .listen(PORT , () => {console.log(`Listening on port ${PORT} \n Check http://localhost:9010/`)});
}