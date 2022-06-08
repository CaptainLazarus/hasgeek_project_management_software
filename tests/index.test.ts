import { Util } from '../src/utils/Util';
import { Emails } from '../src/utils/Email';
require("dotenv").config();

test("llequal", () => {
    expect(Util.llequal([1, 2, 3], [6, 7])).toBe(false);
    expect(Util.llequal([1, 2, 3], [6, 7, 4])).toBe(true);
    expect(Util.llequal([1, 2, 3], [6, 7, 4, 10])).toBe(true);
});

test("lequal", () => {
    expect(Util.lequal([1, 2, 3], [6, 7])).toBe(false);
    expect(Util.lequal([1, 2, 3], [6, 7, 4])).toBe(true);
    expect(Util.lequal([1, 2, 3], [6, 7, 4, 10])).toBe(false);
});

test("glequal", () => {
    expect(Util.glequal([1, 2, 3], [6, 7])).toBe(true);
    expect(Util.glequal([1, 2, 3], [6, 7, 4])).toBe(true);
    expect(Util.glequal([1, 2, 3], [6, 7, 4, 10])).toBe(false);
});

test("Checking email functions", async () => {
    const EMAIL: string = (typeof process.env.EMAIL === 'undefined') ? ("") : process.env.EMAIL;
    const PASSWORD: string = (typeof process.env.PASSWORD === 'undefined') ? ("") : process.env.PASSWORD;
    let text: string = "Hello ${NAME}, how's ${ADDRESS}?"; // Take from user
    let varNames: string[] = ["NAME", "ADDRESS"]; // Take from user
    let inputValues: string[][] = [["aditya", "hyderabad"], ["priya", "gwalior"]]; // Take from CSV
    let output: string[] = [];

    const email = new Emails(EMAIL, PASSWORD);
    
    // expect(EMAIL).toBe("adityagudimetla@gmail.com");
    expect(email.validEmail("test@gmail.com")).toBe(true);
    expect(email.validEmail("@test@gmail.com")).toBe(false);
    expect(email.composeEmail(text , varNames , inputValues)).toEqual(["Hello aditya, how's hyderabad?" , "Hello priya, how's gwalior?"]);
});